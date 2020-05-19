const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors');
var cookieParser = require('cookie-parser');
//api
const index = require('./routes/index')
var download = require('./routes/fetch')
var payment = require('./routes/payment')
var upload = require('./routes/upload')
var instructor = require('./routes/instructor')
var rekognition = require('./routes/rekognition')

var student = require('./routes/Student')
const mongoose=require('mongoose');
var session = require('express-session')

const port = process.env.PORT || 3001;
const baseUrl = `http://localhost:${port}`;

class InMemoryFriends {
    constructor() {
        this.list = [];
    }
 
    add(name) {
        this.list.push(name);
    }
 
    getAll() {
        return this.list;
    }
 }
 const friendsList = new InMemoryFriends();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'views');

app.use(bodyParser.json());
app.use(cookieParser());

//DB config
const db=require('../config').MongoURI;

//connect to Mongo
mongoose.connect(db,{ useNewUrlParser: true})
.then(()=>console.log('MongoDb connected!!'))
.catch(err=>console.log(err));

// app.use(cors(
//     {
//         // origin: ['http://localhost:3000','https://www.geethupadachery.com/'],
//         origin : /geethupadachery\.com$/,
//         methods : ['GET', 'PUT', 'POST','DELETE','HEAD','OPTIONS'],
//         allowedHeaders : ['Content-Type', 'Authorization'],
//         credentials: true
//     }
// ));

app.use(cors({
    origin: /geethupadachery\.com$/,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.options('*', cors())


app.all('', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", /geethupadachery\.com$/);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //Auth Each API Request created by user.
    next();
});

app.use(session({
    secret: 'my_secret_key_dropBox',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,    //setting the time for active session 10 min
    activeDuration: 5 * 60 * 1000,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    //     signed: false,
    //     httpOnly: false,
    //     // secure: true | 'auto',
    //     // sameSite: true | 'lax' | 'strict' | 'none'
    }
}))


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index);
app.use('/download', download);
app.use('/payment', payment);
app.use('/upload', upload);
app.use('/instructor', instructor);
app.use('/', student);
app.use('/rekognition', rekognition);

app.get('/', (req, res) => {
   res.render('index', {personList: friendsList.getAll()});
});

app.post('/submit', (req, res) => {
   friendsList.add(req.body.friendName);
   res.render('person-added', { personName: req.body.friendName, personList: friendsList.getAll() });
});
// Server
module.exports = app;