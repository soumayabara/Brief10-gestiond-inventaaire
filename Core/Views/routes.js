const express = require('express')
const router = express.Router()

const dbconfig = require('../Model/database')


router.get('/', (req, res, next) => {
    res.render('auth.ejs', { title: 'Authentication Page', lmessage: req.flash('loginMessage'), smessage: req.flash('signupMessage') })
})



module.exports = router;