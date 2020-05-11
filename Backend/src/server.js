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
const db=require('../src/routes/models/keys').MongoURI;

//connect to Mongo
mongoose.connect(db,{ useNewUrlParser: true})
.then(()=>console.log('MongoDb connected!!'))
.catch(err=>console.log(err));

app.use(cors(
    {
        origin: ['http://localhost:3000','https://localhost:3000','https://www.geethupadachery.com'],
        // origin : /geethupadachery\.com$/,
        methods : ['GET', 'PUT', 'POST','DELETE'],
        // allowedHeaders : ['Content-Type', 'Authorization'],
        credentials: true
    }
));

app.use(session({
    secret: 'my_secret_key_dropBox',
    resave: false,
    saveUninitialized: true,
    duration: 30 * 60 * 1000,    //setting the time for active session 10 min
    activeDuration: 5 * 60 * 1000,
}))


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index);
app.use('/download', download);
app.use('/payment', payment);
app.use('/upload', upload);
app.use('/instructor', instructor);
app.use('/', student);
// app.use('/zoom', zoom);

app.get('/', (req, res) => {
   res.render('index', {personList: friendsList.getAll()});
});

app.post('/submit', (req, res) => {
   friendsList.add(req.body.friendName);
   res.render('person-added', { personName: req.body.friendName, personList: friendsList.getAll() });
});
// Server
module.exports = app;