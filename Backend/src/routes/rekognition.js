var express = require('express');
var app = express();
// const Rekognition = require('node-rekognition')
var AWS = require("aws-sdk");
var AWSS3 = require("aws-sdk");
const multer = require("multer");
const config = require("../../config");
var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 10 * 1024 * 1024}});

app.post("/compareMyBucket", upload.single("file"), async function (req, res) {
    //File Upload started
    const file = req.file;
    console.log('request file')
    console.log(file);
   

    let s3bucket = new AWSS3.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID_M,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY_M,
        region: 'us-east-2'
    });

    //Location of store for file upload
    var params = {
        Bucket: "drivetime-user-images-compare",
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };


   await s3bucket.upload(params, async function (err, data) {
        var cnt = "";
        if (err) {
            console.log(err)
            // res.status(500).json({error: true, Message: err});
        } else {
            console.log("Uploading is working good")
            console.log(data);
            console.log('**************************************');
            let myName = (req.session.username).replace('@gmail.com','')+".jpg";
            console.log(myName)
            var params1 = {
                SimilarityThreshold: 90, 
                SourceImage: {
                 S3Object: {
                  Bucket: "drivetime-user-images", 
                  Name: myName
                 }
                }, 
                TargetImage: {
                 S3Object: {
                  Bucket: "drivetime-user-images-compare", 
                  Name: file.originalname
                 }
                }
               };
        
            var rekognition = new AWS.Rekognition({
                accessKeyId: config.AWS_ACCESS_KEY_ID_M,
                secretAccessKey: config.AWS_SECRET_ACCESS_KEY_M,
                region: 'us-east-2'
            });
            
            try{
                await rekognition.compareFaces(params1, function (err, data) {
                    if (err){
                        console.log(err, err.stack); // an error occurred
                        res.status(200).json({error: false, Message: "FaceNotMatched"});
                    } 
                    else {  
                        console.log(data);  
                        if(data.FaceMatches && data.FaceMatches.length > 0 && data.FaceMatches[0].Similarity> 90){ 
                            res.status(200).json({error: false, Message: "FaceMatched"});
                        }
                        else{
                            res.status(200).json({error: false, Message: "FaceNotMatched"});
                        }  
                    }       // successful response
                });
            }
            catch(e){
                res.status(200).json({error: false, Message: "FaceNotMatched"});
            }
        }
    });
});


app.post("/uploadMyBucket", upload.single("file"), async function (req, res) {
    //File Upload started
    const file = req.file;
    console.log('request file')
    console.log(file);
    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID_M,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY_M,
        region: 'us-east-2'
    });
    //Location of store for file upload
    var params = {
        Bucket: "drivetime-user-images",
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };


   await s3bucket.upload(params, function (err, data) {
        if (err) {
            console.log(err)
            res.status(200).json({error: true, Message: err});
        } else {
            console.log("Uploading is working good")
            console.log(data);
            res.status(200).json({error: false, Message: "Upload successfule"});
            
        }
    });
});
module.exports = app;