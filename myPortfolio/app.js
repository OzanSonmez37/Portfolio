const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const app = express()
const port = 3000
const hostname = '127.0.0.1'
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const {generateDate, truncate} = require('./helpers/hbs')
const expressSession = require('express-session')
const methodOverride = require('method-override')

mongoose.connect('mongodb://127.0.0.1/portfolio_db')

const mongoStore = require('connect-mongo')

app.use(expressSession({
    secret: 'testotesto',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        mongoUrl: 'mongodb://127.0.0.1/portfolio_db'
    })
})) 

app.use(fileUpload())
app.use(express.static('public'))
app.use(methodOverride('_method')) 

// Handlebars Helpers
const hbs = exphbs.create({
    helpers: {
        generateDate: generateDate,
        truncate: truncate
    }
})

app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// DISPLAY LINK Middleware
app.use((req, res, next) => {
    const {userId} = req.session
    if(userId) {
        res.locals = {
            displayLink: true,
        }
    } else {
        res.locals = {
            displayLink: false,
        }
    }
    next()
})

// Message Middleware
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})

// Yönlendirme
const main = require('./routes/main')
const projects = require('./routes/projects')
const users = require('./routes/users')
const admin = require('./routes/admin/index')
const contact = require('./routes/contact')
app.use('/', main)
app.use('/projects', projects)
app.use('/users', users)
app.use('/admin', admin)
app.use('/contact', contact)

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
