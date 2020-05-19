var express = require('express');
//var app = express();
var app = express.Router();
const config = require('../../config');
var mysql = require('./db/sql');
const Student = require('./models/StudentDetails');

app.get('/testIndexApi', function(req, res){
    res.status(200).send('Api is Working');
});

app.post('/login', function (req, res) {
    var sqlQuery = "select * from authDB.user_data d WHERE (`username` = '" + req.body.username + "') and (`password` = '" + req.body.password + "')";
    console.log(sqlQuery);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            if (results.length === 1) {
                req.session.username = req.body.username;
                req.session.firstName = results[0].firstname;
                req.session.lastName = results[0].lastname;
                req.session.user_id = results[0].user_id;
                req.session.usertype = results[0].usertype;
                req.session.userFullName = results[0].firstname+" "+results[0].lastname;
                // res.status(200);
                res.status(200).send({result: results});
            }
            else {
                res.status(403);
                res.send({msg: 'Invalid credentials'});
            }
        }
    }, sqlQuery);
});

app.get('/getloggedInUserData', function (req, res) {
    console.log('req.session',req.session)
    var sqlQuery = "select * from authDB.user_data d WHERE (`username` = '" + req.session.username + "')";
console.log('sqlQuery',sqlQuery)
    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            //console.log(results);
            
            if (results.length === 1) {
                
                res.status(200).send({result: results});
            }
            else {
                res.status(403);
                res.send({msg: 'Invalid credentials'});
            }


        }
    }, sqlQuery);
});


app.get('/checkLogin', function (req, res) {
    console.log('check login')
    console.log(req.session)
    if (req.session.username && req.session.username !== "") {
        res.status(200).send({loggedInUser: req.session});
    }

    else {
        // res.status(200);
        // res.send({msg: 'No user logged In'});
        res.status(200).send({loggedInUser: "admin"});
    }
});


app.post('/register', function (req, res, next) {

    var sqlselectQuery = "select count(*) as cnt from `user_data` where ( `username` = '" + req.body.username + "')";
    
    mysql.fetchData(function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(results[0].cnt);
            console.log((Number(results[0].cnt) > 0));
            if ((Number(results[0].cnt) > 0)) {
                res.statusMessage = "User present";
                res.status(403).send({result: results});
                return;
            } else {
                console.log("user not present continue to insert");
                var sqlQuery = "INSERT INTO `user_data` ( `username`, `password`, `firstname`, `lastname`,`email`,`modifieddate`,`phone`,`usertype`,`userImage`) VALUES ('" + req.body.username + "', '" + req.body.password + "', '" + req.body.firstname + "', '" + req.body.lastname + "', '" + req.body.email + "', " + "now()" + ", '" + req.body.phone + "', '" + req.body.usertype + "', '" + req.body.userImage + "')";

                mysql.fetchData(function (err, results) {
                    if (err) {
                        throw err;
                    }
                    else {

                        console.log("Insert Complete");
                        res.statusMessage = "Insert Complete";
                        res.status(200).send({result: results});

                    }
                }, sqlQuery);
            }
        }
    }, sqlselectQuery);
});


app.get('/fetchs3data', function (req, res) {

    //for testing okta added this line
    var sqlQuery = "select d.username,d.firstname,d.lastname,f.file_name,f.filedesc,f.fileuploadtime,DATE_FORMAT(f.filecreatedate, '%d-%m-%Y %H:%i:%s') as filecreatedate,DATE_FORMAT(f.filemodifieddate, '%d-%m-%Y %H:%i:%s') filemodifieddate,f.fileurl,d.usertype from authDB.user_files f join authDB.user_data d";// on d.user_id=f.userid";
    // var sqlQuery = "select d.username,d.firstname,d.lastname,f.file_name,f.filedesc,f.fileuploadtime,DATE_FORMAT(f.filecreatedate, '%d-%m-%Y %H:%i:%s') as filecreatedate,DATE_FORMAT(f.filemodifieddate, '%d-%m-%Y %H:%i:%s') filemodifieddate,f.fileurl,d.usertype from authDB.user_files f join authDB.user_data d on d.user_id=f.userid WHERE (`username` = '" + req.session.username + "')";

    if (req.session.username === "admin") {
        sqlQuery = "select d.username,d.firstname,d.lastname,f.file_name,f.filedesc,f.fileuploadtime,DATE_FORMAT(f.filecreatedate, '%d-%m-%Y %H:%i:%s') as filecreatedate,DATE_FORMAT(f.filemodifieddate, '%d-%m-%Y %H:%i:%s') filemodifieddate,f.fileurl,d.usertype from authDB.user_files f join authDB.user_data d";// on d.user_id=f.userid";
    }

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {

            console.log("Fetch Complete for UI");
            res.statusMessage = "Fetch Complete";
            console.log(results)
            res.status(200).send({result: results});

        }
    }, sqlQuery);
});

app.get('/fetchallusers', function (req, res) {

    var sqlQuery = "select * from authDB.user_data d where d.username <> 'admin'";

    console.log(sqlQuery);

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {

            console.log("Fetch Complete for UI");
            res.statusMessage = "Fetch Complete";
            res.status(200).send({result: results});

        }
    }, sqlQuery);
});


app.get('/logout', function (req, res) {

    if (req.session.username) {
        req.session.destroy();
        res.status(200);
        res.send({msg: 'User logged out Successfully'});
    }
    else {
        res.status(403);
        res.send({msg: 'No user is logged in'});
    }
});

app.post('/login/OAuth', function (req, res) {
    console.log('inside oauth')

    //check if user data is available
    var sqlQuery = "select * from authDB.user_data d WHERE `username` = '" + req.body.email + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            // New User
            if(results.length === 0) {
                console.log("user not present continue to insert");
                var insertQuery = "INSERT INTO `user_data` ( `username`, `password`, `firstname`, `lastname`,`email`,`modifieddate`,`phone`,`usertype`) VALUES ('" + 
                                        req.body.username + "', '" + req.body.password + "', '" + req.body.firstname + "', '" + 
                                        req.body.lastname + "', '" + req.body.email + "', " + "now()" + ", '" + req.body.phone + "','student')";
                mysql.fetchData(function (err, insertResults) {
                    console.log('Results inside:: ');
                    console.log(insertResults.length);
                    console.log(insertResults[0]);                    
                    if (err) {
                        throw err;
                    }
                    else {
                        console.log("Insert Complete");
                        var sqlQueryAgain = "select * from authDB.user_data d WHERE (`username` = '" + req.body.username + "')";
                        console.log(sqlQueryAgain);
                    
                        mysql.fetchData(function (err, resultsAgain) {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log(resultsAgain.length);
                                console.log(resultsAgain[0]);
                                if (resultsAgain.length === 1) {
                                    req.session.username = req.body.username;
                                    req.session.firstName = resultsAgain[0].firstname;
                                    req.session.lastName = resultsAgain[0].lastname;
                                    req.session.user_id = resultsAgain[0].user_id;
                                    req.session.usertype = results[0].usertype;
                                    req.session.userFullName = results[0].firstname+" "+results[0].lastname;
                                    res.statusMessage = "Insert Complete";
                                    res.status(200).send({result: resultsAgain});
                                }
                                else {
                                    res.status(403);
                                    res.send({msg: 'Invalid credentials'});
                                }
                            }
                        }, sqlQueryAgain);
                    }
                }, insertQuery);
            } else {
                req.session.username = req.body.username;
                req.session.firstName = req.body.firstname;
                req.session.lastName = req.body.lastname;
                req.session.usertype = results[0].usertype;
                req.session.userFullName = results[0].firstname+" "+results[0].lastname;
                req.session.user_id = results[0].user_id;
                res.status(200).send({result: results}); 
            }                   
        }
    }, sqlQuery);
});


//getfeedbackForstudent
app.post('/login/getfeedbackForstudent', async function (req, res) {

console.log('Inside Feedback');
    let username=req.body.email;
    if(username ==='jigneshdinesh.madhani@sjsu.edu'){
        username='admin' 
    }
    //check if user data is available
    var sqlQuery = "SELECT * FROM `rentITDB`.`StudentFeedback` c where  c.username='" + req.session.username + "' ";

    //check if user data is available
    // var sqlQuery = "select * from authDB.user_data d WHERE `username` = '" + req.body.email + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {

            console.log('results')
            console.log(results)
            // User Present
            res.status(200).send({result: results}); 
        }
    }, sqlQuery);
    console.log(req.session)
});


app.post('/login/octa', async function (req, res) {


    let username=req.body.email;
    if(username ==='jigneshdinesh.madhani@sjsu.edu'){
        username='admin' 
    }
    //check if user data is available
    var sqlQuery = "select * from authDB.user_data d WHERE `username` = '" + username + "'";

    //check if user data is available
    // var sqlQuery = "select * from authDB.user_data d WHERE `username` = '" + req.body.email + "'";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {

            console.log('results')
            console.log(results)
            // User Present
            if(results.length === 1) {
                req.session.username = results[0].username;
                req.session.firstName = results[0].firstname;
                req.session.lastName = results[0].lastname;
                req.session.usertype = results[0].usertype;
                req.session.userFullName = results[0].firstname+" "+results[0].lastname;
                // req.session.user_id = results[0].user_id;
                console.log('Session set!');
                console.log(req);
                res.status(200).send({result: results}); 
            }else{
                res.status(403).send({result: results}); 
            }                   
        }
    }, sqlQuery);
    console.log(req.session)
});

//Manish
//check profile is complete?
app.get('/home/checkprofile', function (req, res) {
    
    var name=req.session.username;

    Student.findOne({ Name:name })
        .then(student => {
            
            if(student){
                console.log("Profile is already completed");
                res.status(200).send({student:student});
            }
            else{
                console.log("Profile is not completed");
                req.session.profileStatus = 'incomplete';
                res.status(200).send();
            }
            
        })
});

//enroll form submission
app.post('/home/enroll', function (req, res) {

    var name=req.session.username;

    Student.findOne({ Name:name })
        .then(student => {
            
            if(student){
                     Student.update({_id:student._id}, {
                        Name: name,
                        Minor : req.body.minor,
                        Address: req.body.address,
                        Country : req.body.country,
                        PhoneNumber : req.body.phone,
                        Gender : req.body.gender,
                        City:req.body.city,
                        DOB : req.body.dob.substring(0,10),
                        ctype:req.body.ctype,
                        dualcontrol:req.body.dualcontrol,
                        ilicence:req.body.ilicence,
                        UserFullName:req.session.userFullName
                     })
                     .then(student => {
                        console.log("Student details updates successfully");
                        res.status(200).send();
                    })
                    .catch(err=>console.log(err));
            }else{
            
                const newStudent = new Student({

                    Name: name,
                    Minor : req.body.minor,
                    Address: req.body.address,
                    Country : req.body.country,
                    PhoneNumber : req.body.phone,
                    Gender : req.body.gender,
                    City:req.body.city,
                    DOB : req.body.dob.substring(0,10),
                    UserFullName:req.session.userFullName
                });

                newStudent.save()
                .then(student => {
                    console.log("Student details saved successfully");
                    res.status(200).send();
                })
                .catch(err=>console.log(err));
            }
        })
});

app.get('/home', function (req, res) {

    let user=req.session.username;

    Student.findOne({ Name: user })
        .then(student => {
        
            if(student){
                if(student.schedule === undefined || student.schedule.length === 0){
                    res.statusMessage = "student profile found!";
                }
                else{
                    res.statusMessage = "Schedule already present!";
                }
            }
            else{
                res.statusMessage = "No student profile found!";
            }
            res.status(200).send();
    })
    .catch(err=>console.log(err));
});

module.exports = app;