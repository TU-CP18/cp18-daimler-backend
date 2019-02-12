require('dotenv').config();
const R = require('ramda');
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

app.post('/api/log', (req, res) => {
    logger.info({ ...req.body });
    logger.flush();
    return res.status(200).end();
});

function formatEsDocument(doc) {
    const FIELDS_TO_OMIT = ['@version', 'time', '@timestamp', 'v', 'port', 'pid', 'hostname', 'host', 'level'];
    FIELDS_TO_OMIT.forEach(f => delete doc[f]);
    return doc;
}

app.get('/api/cars', async (req, res, next) => {
    let data = {
        "size": 0,
        "query": { "match": { "type": "NAV_POSITION" } },
        "aggs": {
            "bucket": { "terms": { "field": "vehicleId.keyword" },
            "aggs": {
                "lastPosition": {
                    "top_hits": {
                        "size": 1,
                        "sort": [{ "timestamp": { "order": "desc" } }]
                    }
                }
            }
            }
        }
    }

    try {
        const response = await esAxiosClient.get('/_search', { data });
        const innerBuckets = response.data.aggregations.bucket.buckets.map(b => b.lastPosition.hits.hits);
        const locationLogs = R.flatten(innerBuckets).map(d => ({ id: d._id, ...formatEsDocument(d._source) }));
        res.status(200).json(locationLogs);
    } catch (e) {
        next(e);
    }
});

app.get('/api/logs', /* authorize(JWT_SECRET, JWT_ALGORITHM), */ async (req, res, next) => {
    let query = {}

    if (req.query.type) {
        query = { match: { type: req.query.type } };
    }

    if (req.query.vehicleId) {
        query = query.match ? { match: { ...query.match, vehicleId: req.query.vehicleId } } : { match: { vehicleId: req.query.vehicleId } };
    }

    const formatLog = ({ _id, _source }) => ({ id: _id, ..._source });

    let data = { size: 250, sort: { timestamp: { order: 'desc' }} };
    data = Object.keys(query).length > 0 ? { ...data, query } : data;

    try {
        const response = await esAxiosClient.get('/_search', { data });
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

const putMappingInterval = setInterval(() => {
    esAxiosClient.put('/_mapping/doc', {
        properties: {
            hostname: { type: 'text' },
            timestamp: { type: 'date' },
            source: { type: 'keyword' },
            type: { type: 'keyword' },
            location: { type: 'geo_point' },
            description: { type: 'text' },
            destination: { type: 'geo_point' },
            vehicleId: { type: 'keyword' },
            driverId: { type: 'keyword' },
            shiftId: { type: 'keyword' },
        },
    }).then(() => {
        clearInterval(putMappingInterval);
    }).catch((e) => { });
}, 5000);
