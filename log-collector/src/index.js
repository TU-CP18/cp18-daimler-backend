require('dotenv').config();
const logger = require('pino')({ level: process.env.LOG_LEVEL || 'info' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const axios = require('axios').default;

const app = express();

// Refer: Express in production best practices
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

const authorizeJwtToken = () => (req, res, next) => {
    logger.debug('TODO: JWT Token Validation');
    next();
}

app.use(authorizeJwtToken());

// TODO: JWT token Authentication
app.post('/api/log', (req, res) => {
    logger.info({ ...req.body });
    logger.flush();
    return res.status(200).end();
});

// TODO: Filter by geo-box
app.get('/api/car-status', async (req, res) => {
    const response = await axios.get('http://localhost:9200/cpdaimler-events/_search', {
        data: {
            "aggs": {
                "car": {
                    "terms": {
                    "field": "carLicense.keyword",
                    "size": 100
                    },
                    "aggs": {
                    "group_docs": {
                        "top_hits": {
                        "size": 1,
                        "sort": [
                            {
                            "timestamp": {
                                "order": "desc"
                            }
                            }
                        ]
                        }
                    }
                    }
                }
            }
        },
    });

    const formattedData = response.data.aggregations.car.buckets.map(b => b.group_docs.hits.hits[0]._source);
    res.status(200).json(formattedData);
});

const PORT = process.env.LOG_COLLECTOR_PORT || 8000;
app.listen(PORT, () => {
    logger.debug({ message: 'Log collector started', port: PORT });
});
