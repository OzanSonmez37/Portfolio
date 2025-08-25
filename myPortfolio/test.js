const mongoose = require('mongoose')

const Post = require('./models/Post')

mongoose.connect('mongodb://127.0.0.1/portfolio_test_db', {
    
})

Post.create({
    projectName: 'My third project',
    projectDescription: 'This is a description of my third project.'
})
.then(post => {
    console.log(post);
})
.catch(error => {
    console.log(error);
})
