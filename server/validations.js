const {body} = require('express-validator');

class Validations {
    loginValidator = [
        body('email').isEmail(),
        body('password').isLength({min: 5}),
    ];
    registerValidator = [
        body('email').isEmail(),
        body('password').isLength({min: 5}),
        body('fullName').isLength({min: 3}),
        body('avatarUrl').optional().isURL(),
    ];
    postCreateValidator = [
        body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
        body('text', 'Введите текс статьи').isLength({min: 3}).isString(),
        body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
        body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
    ];
}
module.exports = new Validations;