const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const UserModel = require("../modles/User");
const jwt = require("jsonwebtoken");

class UserController {
    async register(req, res) {
        try {
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
    }

    async login(req, res) {
        try {
            const user = await UserModel.findOne({email: req.body.email});
            console.log(user)
            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден',
                });

            }
            const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)
            if (!isValidPass) {
                return res.status(400).json({
                    message: 'Неверный логин или пароль',
                });
            }
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
                message: 'Не удалось авторизоваться',
            })
        }
    }

    async me(req, res) {
        try {
            console.log(req.userId)
            const user = await UserModel.findById(req.userId);
            console.log(user)
            if (!user) {
                return res.status(404).json({
                    message: 'Пользователь не найден'
                })
            }
            const {passwordHash, ...userData} = user._doc;

            res.json(userData)
        } catch (err) {
            res.status(500).json({
                message: 'Нет доступа1'
            })
        }
    }
}

module.exports = new UserController();