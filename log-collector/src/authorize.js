const jwtSimple = require('jwt-simple');

function authorize(jwtSecret, jwtAlgorithm) {
    return (req, res, next) => {
        if (process.env.NODE_ENV === 'development') next();

        const token = (req.get('authorization') || req.get('x-authorization') || '').replace(/^Bearer\s*/, '');
        if (!token) { return res.status(401).end(); }

        // TODO: Forbit roles other than Fleet Manager
        try {
            const payload = jwtSimple.decode(token, jwtSecret, false, jwtAlgorithm);
            if (!payload.sub) { return res.status(401).end(); }
            if (!(['fleetmanager', 'admin'].includes(payload.sub))) { return res.status(403).end(); }
            if (payload.exp < +new Date()) { return res.status(401); }

            next();
        } catch (e) {
            return res.status(401).end();
        }
    };
}

module.exports = authorize;
