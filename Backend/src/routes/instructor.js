var express = require('express');
// var router = express.Router();
var app = express();
var AWS = require("aws-sdk");
const multer = require("multer");
const config = require("../../config");
var mysql = require('./db/sql');
var moment = require('moment');
const instructorschedule= require('./models/instructorSchedule');
const Student = require('./models/StudentDetails');

app.get('/testInstructorApi', function(req, res){
    res.status(200).send('Api is Working');
});

app.get('/getISchedule', async function (req, res) {
//instructorschedules
var name=req.session.username;
if(name==='admin'){

    await instructorschedule.find((err, data) => {
        res.statusMessage = "Fetch Complete";
        res.status(200).send({result: data});
    });
} 
else{
    await instructorschedule.find({ iusername : name },(err, data) => {
        res.statusMessage = "Fetch Complete";
        res.status(200).send({result: data});
    });
}

});

// GET to upload
app.post('/createinstructorSchedule', async function (req, res) {
    
    var username=req.session.username;
    var instructorcity="";
    var userFullName=req.session.userFullName;

     await Student.findOne({ Name:username })
        .then(student => {
            
            if(student){
                req.session.city = student.City;
                instructorcity = student.City;

            }
            else{
                instructorcity = "NA";

            }
            
        });


var now = moment(req.body.fromdate);
var later = moment(req.body.todate);
var cnt=(later.diff(now,"days")+1);
var dateArray = [];
for(var i=0; i<cnt; i++){
    dateArray.push(now.format("DD-MMM-YYYY"));
    now = moment(now, "DD-MM-YYYY").add(1, 'days');

}
async function init(){
    await sleep(1000)
 }
function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

dateArray.forEach(async function(value){
      
        await init();

        await instructorschedule.findOne({$and:[{ iusername : username} ,{sdate : now.format("DD-MMM-YYYY")}]})
        .then(ischedule => {
            
            if(ischedule){
                console.log("Schedule present for date"+value);
            }else{
            
                const ISchedule =  new instructorschedule({
                    iusername : username,
                    sdate : value,
                    UserFullName:userFullName,
                    city:instructorcity,
                    slot0810:req.body.slot0810,
                    slot1012:req.body.slot1012,
                    slot1214:req.body.slot1214,
                    slot1416:req.body.slot1416,
                    slot1618:req.body.slot1618,
                    slot1820:req.body.slot1820,
                    slot2022:req.body.slot2022
                  });
                  
                  ISchedule.save()
                  .then(user => {
                      console.log('Schedule created!');

                  })
                  .catch(err=>{
                      console.log(err);
                    });
            }
        })
    });
    res.statusMessage = "Schedule Created";      
    res.status(200).send({message: "Got result from GET"});
});

app.post('/updateIdetails', function (req, res, next) {
   
    var sqlQuery = "UPDATE `authDB`.`user_data` SET `password` = '" + req.body.password + "',`firstname` = '" + req.body.firstname + "',`lastname` = '" + req.body.lastname + "',`email` = '" + req.body.email + "',`phone`= '" + req.body.phone + "',`modifieddate`=now()  WHERE (`username` = '" + req.body.username + "')";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            res.statusMessage = "Insert Complete";
            res.status(200).send({result: results});

        }
    }, sqlQuery);
});

app.post('/deleteISdetails', function (req, res, next) {

//instructorschedules
var name=req.session.username;
var deletiondate=req.body.sdate;  

instructorschedule.deleteOne({ iusername : name ,sdate:deletiondate },(err, data) => {
    res.statusMessage = "delete Complete";
    res.status(200).send({result: data});
});
});


app.post('/addFeedback', function (req, res, next) {

    var name=req.session.username;

    var query = "INSERT INTO rentITDB.StudentFeedback  ( username, sessionSlot, instructorName, feedback1, feedback2, feedback3, feedback4, feedback5, feedback6, feedback7, feedback8, feedback9, feedback10) VALUES ('"+req.body.username+"', '"+req.body.session+"', '"+name+"', "+req.body.feedback1+", "+req.body.feedback2+", "+req.body.feedback3+", "+req.body.feedback4+", "+req.body.feedback5+", "+req.body.feedback6+", "+req.body.feedback7+", "+req.body.feedback8+", "+req.body.feedback9+", "+req.body.feedback10+")";
    // console.log(query);
    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            res.statusMessage = "Feedback Added";
            res.status(200).send({result: results});

        }
    }, query);
})



module.exports = app;