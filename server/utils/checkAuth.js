const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
    console.log(token)
    if (token) {
        try {
            const decoded = jwt.verify(token, 'secret1231123');

            req.userId = decoded._id;

            next();
        } catch (err) {
            return res.status(403).json({
                message: 'Нет доступа',
            });
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа',
        });
    }
}