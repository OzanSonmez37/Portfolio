const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/register', (req, res) => {
    res.render('site/register')         
})

router.post('/register', (req, res) => {
    User.create(req.body)
        .then(user => {
            req.session.sessionFlash = {
                type: "alert alert-success",
                message: "Your account added successfully.",
            }
            res.redirect('/users/login')
        })
        .catch(error => {
            res.redirect('/register')
        })
})

router.get('/login', (req, res) => {
    res.render('site/login')          
})

router.post('/login', (req, res) => {
    const {email, password} = req.body

    User.findOne({email})
        .then(user => {
            if (user) {
                if (user.password == password) {
                    req.session.userId = user._id
                    res.redirect('/')
                } else {
                    res.redirect('/users/login')
                }
            } else {
                res.redirect('/users/register')
            }
        })
        .catch(error => {
            res.redirect('/users/login')
        })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })   
})

module.exports = router