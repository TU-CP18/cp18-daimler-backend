require('dotenv').config();
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const axios = require('axios').default;

const authorize = require('./authorize');
const app = express();

const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST || 'localhost';
const ELASTICSEARCH_PORT = parseInt(process.env.ELASTICSEARCH_PORT || '9200', 10);
const ELASTICSEARCH_INDEX = process.env.ELASTICSEARCH_INDEX || 'cpdaimler-events';
const esAxiosClient = axios.create({
    baseURL: `http://${ELASTICSEARCH_HOST}:${ELASTICSEARCH_PORT}/${ELASTICSEARCH_INDEX}/`
});

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_ALGORITHM = process.env.JWT_ALGORITHM || '';

// Check configuration
function configCheck() {
    if (!JWT_SECRET || !JWT_ALGORITHM) {
        logger.fatal({ message: 'JWT_SECRET and JWT_ALGORITHM required' });
        process.exit(-1);
    }
}

// Refer: Express in production best practices
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

// TODO: JWT token Authentication
app.post('/api/log', (req, res) => {
    logger.info({ ...req.body });
    logger.flush();
    return res.status(200).end();
});

app.get('/api/vehicle-log/:license', authorize(), async (req, res, next) => {
    if (!req.params.license || !req.params.license.trim()) {
        return res.status(400).end('Vehicle license not specified');
    }

    const formatLog = ({ _source }) => ({
        source: 'VEHICLE',
        type: 'NAV_POSITION',
        description: _source.description || '',
        timestamp: _source.timestamp,
        location: [ _source.lat, _source.long ],
        license: _source.license,
    });

    try {
        const response = await esAxiosClient.get('/_search', {
            data: {
                size: 250,
                sort: { timestamp: { order: 'desc' }},
                query: { match: { license: req.params.license }}
            },
        });

        res.status(200).json(response.data.hits.hits.map(h => formatLog(h)));
    } catch (e) {
        next(e);
    }
});

const PORT = process.env.LOG_COLLECTOR_PORT || 8000;
configCheck();
app.listen(PORT, () => {
    logger.debug({ message: 'Log collector started', port: PORT });
});

// Send mappings to elasticsearch
esAxiosClient.put('/_mapping/doc', {
    properties: {
        hostname: { type: 'text' },
        timestamp: { type: 'date' },
        source: { type: 'keyword' },
        type: { type: 'keyword' },
        location: { type: 'geo_point' },
        description: { type: 'text' },
        destination: { type: 'geo_point' },
        license: { type: 'keyword' },
        driverId: { type: 'keyword' },
        shiftId: { type: 'keyword' },
    },
}).then(() => {
    logger.debug({ message: 'Added mappings to elasticsearch'});
}).catch((e) => {
    logger.fatal({ message: 'Failed to put mappings onto elasticsearch', error: e.response || e });
    process.exit(-1);
})
