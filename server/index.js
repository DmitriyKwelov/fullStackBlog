const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const cors = require('cors')
const UserController = require('./controllers/UserController');
const PostController = require('./controllers/PostController')
const Validations = require('./validations')
const handleValidationErrors = require('./utils/handleValidationErrors')

const checkAuth = require('./utils/checkAuth')

mongoose.set('strictQuery', false);

mongoose
    .connect('mongodb+srv://blog:CVXz8QiixToumIok@cluster0.ozhytfr.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', handleValidationErrors, UserController.login)
app.post('/auth/register', Validations.registerValidator, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.me)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, Validations.postCreateValidator, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, Validations.postCreateValidator, PostController.update);

app.listen(5000, (eror) => {
    if (eror) {
        return console.log(eror);
    }
    console.log('Server Ok')
})