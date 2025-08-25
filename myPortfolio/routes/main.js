const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Category = require('../models/Category')
const User = require('../models/User')

router.get('/', (req, res) => {
    console.log(req.session)
    res.render('site/index')
})

// Veritabanından bilgileri çekme
router.get('/projects', (req, res) => {
    Post.find({}).populate({path: 'author', model: User}).sort({$natural: -1}).lean().then(projects => {
        const topProjects = projects.slice(0, 4);   
        const otherProjects = projects.slice(4);    
        // Number of Category 
        Category.aggregate([
            {
                $lookup:{
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'category',
                    as: 'posts'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    num_of_projects: {$size: '$posts'}
                }
            }
        ]).then(categories => {
            res.render('site/projects', {projects:projects, categories:categories , topProjects, otherProjects})
        })       
    })
})

router.get('/contact', (req, res) => {
    res.render('site/contact')
})

module.exports = router 