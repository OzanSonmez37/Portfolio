const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref:'users' },
    projectDescription: { type: String, required: true },
    date: { type: Date, default: Date.now },
    category: { type: Schema.Types.ObjectId, ref:'categories' },
    project_image: { type: String, required: true }
})

module.exports = mongoose.model('Post', postSchema)