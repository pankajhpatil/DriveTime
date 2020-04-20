const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//api
const index = require('./routes/index')
var download = require('./routes/fetch')
var payment = require('./routes/payment')
var upload = require('./routes/upload')
var instructor = require('./routes/instructor')
var student = require('./routes/Student')

const port = process.env.PORT || 5000;
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


app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', index);
app.use('/download', download);
app.use('/payment', payment);
app.use('/upload', upload);
app.use('/instructor', instructor);
app.use('/', student);

app.get('/', (req, res) => {
   res.render('index', {personList: friendsList.getAll()});
});

app.post('/submit', (req, res) => {
   friendsList.add(req.body.friendName);
   res.render('person-added', { personName: req.body.friendName, personList: friendsList.getAll() });
});
// Server
module.exports = app;