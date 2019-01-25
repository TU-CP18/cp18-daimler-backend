const jwtSimple = require('jwt-simple');

function authorize(jwtSecret, jwtAlgorithm) {
    return (req, res, next) => {
        if (process.env.NODE_ENV === 'development') next();

        const token = (req.get('authorization') || req.get('x-authorization') || '').replace(/^Bearer\s*/, '');
        if (!token) { return res.status(401).end(); }

        // TODO: Forbit roles other than Fleet Manager
        try {
            const payload = jwtSimple.decode(token, jwtSecret, false, jwtAlgorithm);
            next();
        } catch (e) {
            return res.status(401).end();
        }
    };
}

module.exports = authorize;
