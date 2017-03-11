var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
    // allow tokens to be included in body, querystring or header
    var app = req.app;
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    console.log("This middleware was attempted. " + token);
    if (token) {
        try {
            var decodedToken = jwt.decode(token, app.get('jwtTokenSecret'));
            if (decodedToken.exp <= Date.now()) {
                res.end('Access token expired', 400);
            }
            // if token is valid, attach associated collection to req
            req.inventoryName = decodedToken.iss;
            next();
        } catch(err) {
            return next(err);
        }
    } else {
        next();
    }
};
