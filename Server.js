const express = require('express')
const bodyPraser = require('body-parser')
const path = require('path')
const fileUpload = require('express-fileupload');
const Config = require('./Core/Config/config')


// Importation Passport Configuration
const passport = require('./Core/Controller/passport')
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express()

// **************** STATIC WEB PAGES ****************
app.use(express.static(path.join(__dirname, './public/')));
app.use(express.static(path.join(__dirname, './views/')));
app.use(express.static(path.join(__dirname, './uploads/')));
app.use('/static', express.static('uploads'));

// *********** BODY-PARSER ***********
app.use(bodyPraser.urlencoded({ extended: false }));
app.use(bodyPraser.json());

// *********** EJS ENGINE ***********
app.set('view engine', 'ejs');

// ********** fileUploader ***********
app.use(fileUpload())




app.use(session({
    secret: 'justasecret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(morgan('dev'));
app.use(cookieParser());





app.use('/', require('./Core/Views/routes'))
app.use('/apis', require('./Core/Controller/controle'))



//SERVER
const server = app.listen(Config.server.port, Config.server.host, () => {
    console.log(`The Server Is Running On The Port :`, server.address().port);
});
