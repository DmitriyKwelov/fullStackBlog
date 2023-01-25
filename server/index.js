const express = require('express')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
// const {registerValidator} = require('./validations/aurh')
const {validationResult, body} = require('express-validator');
const UserModel = require('./modles/User')
const bcrypt = require('bcrypt');

mongoose.set('strictQuery', false);

mongoose
    .connect('mongodb+srv://blog:CVXz8QiixToumIok@cluster0.ozhytfr.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express()

app.use(express.json());


app.post('/auth/register', [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),
    body('avatarUrl', 'Неверный ссылка на аватаку').optional().isURL(),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json(errors.array())
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret1231123',
            {
                expiresIn: '30d',
            });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        })
    }
})

app.listen(5000, (eror) => {
    if (eror) {
        return console.log(eror);
    }
    console.log('Server Ok')
})