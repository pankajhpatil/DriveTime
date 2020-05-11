var express = require('express');
// var router = express.Router();
var app = express();
var AWS = require("aws-sdk");
const multer = require("multer");
const config = require("../../config");
var mysql = require('./db/sql');

var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}});

app.get('/testUploadApi', function(req, res){
    res.status(200).send('Api is Working');
});

// GET to upload
app.get('/', function (req, res) {
    res.status(200).send({message: "Got result from GET"});
});


// POST to upload
// upload file to s3 and log file details
app.post("/", upload.single("file"), function (req, res) {
    //File Upload started
    var startDate = new Date();
    const file = req.file;
    const s3FileURL = config.AWS_Uploaded_File_URL_LINK;

    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        region: config.AWS_REGION
    });

    //Location of store for file upload
    var params = {
        Bucket: config.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };


    s3bucket.upload(params, function (err, data) {
        var cnt = "";

        if (err) {
            console.log(err)
            res.status(500).json({error: true, Message: err});
        } else {
            //success
            var url=data.Location;
            url = url.replace('https://drivetimecmpe282.s3.us-east-2.amazonaws.com', 'https://d30e3ftnuh94ar.cloudfront.net');

            res.send({data});

            //File Upload ended       
            var endDate = new Date();
            // console.log(`Difference in seconds:` + (endDate - startDate) / 1000);
            //insert in database
            var newFileUploaded = {
                description: req.body.description,
                fileLink: s3FileURL + file.originalname,
                s3_key: params.Key
            };
            //check if already exisits
            var sqlfetchQuery = "select count(*) as cnt from `authDB`.`user_files` where ( file_name = '" + file.originalname + "')";
            
            mysql.fetchData(function (err, results) {
                if (err) {
                    console.log(err);
                }
                else {

                    cnt = results[0].cnt;

                    if (Number(cnt) > 0) {
                        //update data
                        var sqlupdateQuery = "UPDATE `authDB`.`user_files` SET `fileuploadtime` = '" + ((endDate - startDate) / 1000) + "', `filemodifieddate` = now() ,`filedesc` = 'File Updated' WHERE (`file_name` = '" + file.originalname + "')";

                        mysql.fetchData(function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("update Complete");
                            }
                        }, sqlupdateQuery);
                    }
                    else {
                        //insert data
                        var sqlinsertQuery = "INSERT INTO `authDB`.`user_files` (`userid`, `file_name`,`filedesc`, `fileuploadtime`, `filemodifieddate`, `filecreatedate`, `fileurl`) VALUES ('" + req.session.user_id + "','" + file.originalname + "','" + req.body.description + "', '" + ((endDate - startDate) / 1000) + "', " + "now()" + ", " + "now()" + ", '" + url + "')";

                        mysql.fetchData(function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("Insert Complete");
                            }
                        }, sqlinsertQuery);
                    }
                }
            }, sqlfetchQuery);
        }
    });
});

// POST to delete
// delete from s3 bucket
app.post("/delete", function (req, res) {

    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        region: config.AWS_REGION
    });

    //Location of store for file upload
    var params = {
        Bucket: config.AWS_BUCKET_NAME,
        Key: req.body.fileName,
    };

    s3bucket.deleteObject(params, function (err, data) {

        if (err) {
            res.status(500).json({error: true, Message: err});
        } else {

            var sqldeleteQuery = "    DELETE FROM `authDB`.`user_files` WHERE (`file_name` = '" + req.body.fileName + "')";

            mysql.fetchData(function (err, results) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send({data});
                }
            }, sqldeleteQuery);
        }
    });
});


app.get('/test', function (req, res) {

    var a = Number('1');
    var sqlQuery = "SELECT * from user_data";

    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {

            console.log("Fetch Project Details Successful!");
            res.statusMessage = "Data fetched";
            res.status(200).send({result: results});
        }
    }, sqlQuery);
});


app.post('/updateuser', function (req, res, next) {
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

app.post('/deleteuser', function (req, res, next) {

    var sqlQuery = "delete from `authDB`.`user_data`   WHERE (`username` = '" + req.body.username + "')";
    console.log('*********************')
    console.log(sqlQuery)
    mysql.fetchData(function (err, results) {
        if (err) {
            throw err;
        }
        else {
            res.statusMessage = "Delete Complete";
            res.status(200).send({result: results});
        }
    }, sqlQuery);
});


app.post("/compareUpload", upload.single("file"), async function (req, res) {
    //File Upload started
    const file = req.file;
    console.log('request file')
    console.log(file);
    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID_1,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY_1,
        region: config.AWS_REGION_1
    });

    //Location of store for file upload
    var params = {
        Bucket: config.AWS_BUCKET_NAME_1,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };


    await s3bucket.upload(params, function (err, data) {
        var cnt = "";
        if (err) {
            console.log(err)
            res.status(500).json({error: true, Message: err});
        } else {
            console.log('Upload sucessful')
            console.log(data);
            res.status(200).json({error: false, Message: "Upload successfule"});
        }
    });
});

app.post("/userProfileUpload", upload.single("file"), async function (req, res) {
    //File Upload started
    const file = req.file;
    console.log('request file')
    console.log(file);
    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID_1,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY_1,
        region: config.AWS_REGION_1
    });

    //Location of store for file upload
    var params = {
        Bucket: config.AWS_BUCKET_NAME_2,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };


   await s3bucket.upload(params, function (err, data) {
        var cnt = "";
        if (err) {
            console.log(err)
            res.status(500).json({error: true, Message: err});
        } else {
            console.log("Uploading is working good")
            console.log(data);
            res.status(200).json({error: false, Message: "Upload successfule"});
        }
    });
});

module.exports = app;