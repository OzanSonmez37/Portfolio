const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const Post = require('../../models/Post')
const path = require('path')

router.get('/', (req, res) => {
    res.render('admin/index') 
})

/* CATEGORY PAGE */

// GET REQUEST
router.get('/categories', (req, res) => {
    Category.find({}).sort({$natural: -1}).lean().then(categories => {
        res.render('admin/categories', { categories: categories })
    })
})

// POST REQUEST
router.post('/categories', (req, res ) => {
    Category.create(req.body)
        .then(category => {
            res.redirect('/admin/categories');
        })
        .catch(error => {
            res.redirect('/admin/categories');
        });
})

router.delete('/categories/:id', (req, res) => {
    Category.deleteOne({_id: req.params.id}).then(() => {
        res.redirect('/admin/categories');
    })
})

/* PROJECTS PAGE */

// GET REQUEST
router.get('/projectsAdmin', (req, res) => {
    Post.find({}).populate({path: 'category', model: Category}).sort({$natural: -1}).lean().then(projects => {
        res.render('admin/projectsAdmin', {projects:projects})
    })             
})

router.delete('/projectsAdmin/:id', (req, res) => {
    Post.deleteOne({_id: req.params.id}).then(() => {
        res.redirect('/admin/projectsAdmin');
    })
})

// GÖNDERİLEN İD'Yİ YAKALAMA
router.get('/admin/projectsAdmin/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then(project => {
        Category.find({}).lean().then(categories => {
            res.render('admin/editproject', { project: project, categories: categories })
        })
    })
})

// YAZILAN BİLGİLERİN KAYDEDİLMESİ
router.put('/projectsAdmin/:id', (req, res) => {
    let project_image = req.files.project_image
    project_image.mv(path.resolve(__dirname, '../../public/images/projectimages', project_image.name))

    Post.findOne({_id: req.params.id}).then(project => {
        project.projectName = req.body.projectName
        project.projectDescription = req.body.projectDescription
        project.date = req.body.date
        project.category = req.body.category
        project.project_image = `/images/projectimages/${project_image.name}`

        project.save().then(project => {
            res.redirect('/admin/projectsAdmin')
        })
    })
})

module.exports = router 