const mongoose = require('mongoose');
const {model} = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true,},
    tags: {type: Array, default: []},
    viewsCount: {type: Number, default: 0},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    imageUrl: String,

}, {
    timestamps: true,
})

module.exports = model('Post', PostSchema);