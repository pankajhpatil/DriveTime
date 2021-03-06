var express = require('express');
// var router = express.Router();
var app = express();
const instructorschedule= require('./models/instructorSchedule');
const Student = require('./models/StudentDetails');
const Resource = require('./models/Resources');

app.get('/testStudentApi', function(req, res){
    res.status(200).send('Api is Working');
});

app.post('/home/plans', function (req, res) {
    let startDate=req.body.fromdate;
    let endDate=req.body.todate;

    let slot1012=req.body.slot1012;
    let slot1214=req.body.slot1214;
    let slot1416=req.body.slot1416;
    let slot1618=req.body.slot1618;
    let slot1820=req.body.slot1820;
    let slot2022=req.body.slot2022;

    // console.log(req.body);

        instructorschedule.find({$and: [
            { sdate: { $gte: startDate } }, { sdate: { $lte: endDate}}
        ]},(err, data) => {

        if(Array.isArray(data) && data.length==0){
            res.statusMessage = "No Instructors are Available";
        }
        else{
            res.statusMessage = "Instructors are Available";

            Student.find()
            .then(individualData => { 
                console.log("individualData");
                console.log(data);
                let output = {};
                output.individualData = individualData;
                output.data = data
                res.status(200).send({result: output, statusText: "Instructors are Available"});
        
            })
            .catch(err=>console.log(err));

        }
       
    });

});

app.post('/home/confirm', function (req, res) {
    console.log(req.session)
    let user=req.session.username;
    if(!user){
        console.log('No data',req.session)
    }
    // student details update
    Student.findOne({ Name: user })
        .then(student => {
            
        if(student ){
            
            Student.updateOne({_id:student._id}, {
                schedule: req.body.selectedSchedules,
                plansummary: req.body.planSummary
            })
            .then(student => {
                console.log("Student details updates successfully");
                
            })
            .catch(err=>console.log(err));
        }
    })
    .catch(err=>console.log(err));

    //instructor details update
    let selectedSchedules = req.body.selectedSchedules;
    let tableData = req.body.tableData;

    selectedSchedules.forEach(element => {
        
        tableData.forEach(item => {

            if(item.iusername == element.iusername && item.sdate == element.sdate){

                if(element.slot == 'Slot1- 8am-10am' && item.slot0810 == 'Y'){
                    item.slot0810 = 'Booked_'+user;
                    // item.slot0810 = 'Booked_'+user+'%'+element.sdate;
                }
                else if(element.slot == 'Slot2- 10am-12pm' && item.slot1012 == 'Y'){
                    item.slot1012 = 'Booked_'+user;
                    // item.slot1012 = 'Booked_'+user+'%'+element.sdate;
                }
                else if(element.slot == 'Slot3- 12pm-2pm' && item.slot1214 == 'Y'){
                    item.slot1214 = 'Booked_'+user;
                    // item.slot1214 = 'Booked_'+user+'%'+element.sdate;
                }
                else if(element.slot == 'Slot4- 2pm-4pm' && item.slot1416 == 'Y'){
                    item.slot1416 = 'Booked_'+user;
                    // item.slot1416 = 'Booked_'+user+'%'+element.sdate;
                }
                else if(element.slot == 'Slot5- 4pm-6pm' && item.slot1618 == 'Y'){
                    item.slot1618 = 'Booked_'+user;
                    // item.slot1618 = 'Booked_'+user+'%'+element.sdate;
                }
                else if(element.slot == 'Slot6- 6pm-8pm' && item.slot1820 == 'Y'){
                    item.slot1820 = 'Booked_'+user;
                    // item.slot1820 = 'Booked_'+user+'%'+element.sdate;
                }
                else if(element.slot == 'Slot7- 8pm-10pm' && item.slot2022 == 'Y'){
                    item.slot2022 = 'Booked_'+user;
                    // item.slot2022 = 'Booked_'+user+'%'+element.sdate;
                }
            
                instructorschedule.updateOne({_id:item._id}, {
                    slot0810: item.slot0810,
                    slot1012: item.slot1012,
                    slot1214: item.slot1214,
                    slot1416: item.slot1416,
                    slot1618: item.slot1618,
                    slot1820: item.slot1820,
                    slot2022: item.slot2022
                })
                .then(student => {
                    console.log("Instructor details updates successfully");
                })
                .catch(err=>console.log(err));
            }

        });
    });

    res.status(200).send();
});


app.get('/home/appointments', function (req, res) {

    let user=req.session.username;

    if(user == 'admin'){

        Student.find()
        .then(student => {  
            res.status(200).send({result: student});
        })
        .catch(err=>console.log(err));

    }
    else{

        Student.findOne({ Name: user })
        .then(student => {  
            res.status(200).send({result: student});
        })
        .catch(err=>console.log(err));

    }
    
});
app.post('/home/userdata', function (req, res) {
    
    let user=req.body.username;
    Student.findOne({ Name: user })
        .then(student => {  
            res.status(200).send({result: student});
    })
    .catch(err=>console.log(err));
});
app.get('/home/resources', function (req, res) {

    Resource.find()
        .then(resource => { 
            res.status(200).send({result: resource});
    })
    .catch(err=>console.log(err));

});

app.post('/home/appointments', function (req, res) {

    let rating = req.body.rating;
    let name = req.body.instructor;
    Student.findOne({ Name : name })
    .then(instructor => { 

        if(instructor){

            Student.updateOne({_id:instructor._id}, {
                rating: rating
            })
            .then(student => {
                console.log("rating details updates successfully");
                res.status(200).send();
            })
            .catch(err=>console.log(err));
        }
    })
    .catch(err=>console.log(err));

});

module.exports = app;