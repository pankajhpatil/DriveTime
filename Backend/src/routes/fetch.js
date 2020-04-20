var express = require('express');
var app = express();
// var router = express.Router();
var AWS = require("aws-sdk");
const config = require("../../config");

app.get('/testFetchApi', function(req, res){
    res.status(200).send('Api is Working');
});
// GET list of Objects in bucket
app.get("/", function (req, res) {

    const s3FileURL = config.AWS_Uploaded_File_URL_LINK;

    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        region: config.AWS_REGION
    });

    //Location of store for file upload

    var params = {
        Bucket: config.AWS_BUCKET_NAME
    };

    s3bucket.listObjects(params, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).json({error: true, Message: err});
        } else {
            console.log(data);
            res.send({data});
        }
    });
});

// GET specific file
app.get("/:id", function (req, res) {

    let s3bucket = new AWS.S3({
        accessKeyId: config.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
        region: config.AWS_REGION
    });

    //Location of store for file upload
    var params = {
        Bucket: config.AWS_BUCKET_NAME,
        Key: req.params.id,
    };

    s3bucket.getObject(params, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).json({error: true, Message: err});
        } else {
            console.log(data);
            res.send({url: config.AWS_Uploaded_File_URL_LINK + req.params.id})
        }
    });
});

module.exports = app;