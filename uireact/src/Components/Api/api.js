import axios from 'axios';
import { message } from "antd/lib/index";

// const api = process.env.SERVER_URL || 'https://cw0orhayc7.execute-api.us-east-2.amazonaws.com/dev';
 const api = process.env.SERVER_URL || 'http://localhost:3001';


axios.defaults.withCredentials = true;


export const RESTService = {
    login,
    getTableData,
    register,
    upload,
    deleteFile,
    checkLogin,
    getUserTableData,
    deleteUser,
    logout,
    oAuthlogin,
    checkProfile,
    enroll,
    getinstructorSchedule,
    deleteISdetails,
    createinstructorSchedule,
    getloggedInUserData,
    getInstructorsForDates,
    saveSummary,
    getAppointments,
    validateEnroll,
    getResources,
    getUserdata,
    rating,
    payment,
    uploadImage,
    compareFaces,
    registerOkta,
    octaUserData,
    getfeedbackForstudent,
    uploadToRekognitionDB
};


function login(data) {
    let url = api + '/login';
    return axios.post(url, data);
}

function logout() {
    let url = api + '/logout';
    return axios.get(url);
}

function deleteUser(data) {
    let url = api + '/upload/deleteuser';
    return axios.post(url, data);
}

function checkLogin() {
    let url = api + '/checkLogin';
    return axios.get(url);
}
function getloggedInUserData() {
    let url = api + '/getloggedInUserData';
    return axios.get(url);
}


function register(data) {
    let url = api + '/register';
    return axios.post(url, data);
}

function deleteFile(data) {
    let url = api + '/upload/delete';
    return axios.post(url, data);
}


function upload(data) {
    let url = api + '/upload';

    return axios
        .post(url, data, {
            onUploadProgress: ProgressEvent => {
            },
        })
        .then(res => {
            message.success("File Uploaded Successfully!")
        }).catch(err => {
            message.error("File Size must not exceed 10MB!")
            console.log(err);
            message.error("Cannot Upload Now!")
        })


}


function uploadToRekognitionDB(data){
    let url = api + '/upload/compareUpload';
    return axios.post(url, data)
}


function userProfilePicUpload(data){
    let url = api + '/upload/userProfileUpload';
    return axios.post(url, data)
}

function getTableData() {
    let url = api + '/fetchs3data';
    return axiosGet(url);
}

function getUserTableData() {
    let url = api + '/fetchallusers';
    return axiosGet(url);
}

function oAuthlogin(data) {
    let url = api + '/login/OAuth';
    return axios.post(url, data);
}
function octaUserData(data) {
    let url = api + '/login/octa';
    return axios.post(url, data);
}


function axiosGet(url) {
    return axios.get(url)
        .then(handleSuccess)
        .catch(handleError);
}

function handleSuccess(response) {
    return response;
}

async function handleError(error) {
    if (error.response) {
        // return Promise.reject(error.response);
        return Promise.resolve(error.response);
    }
}

// manish
function checkProfile(data) {
    let url = api + '/home/enroll';
    return axios.get(url, data);
}

function enroll(data) {
    let url = api + '/home/enroll';
    return axios.post(url, data);
}
//To display current instructor schedule
function getinstructorSchedule() {
    let url = api + '/instructor/getISchedule';
    return axiosGet(url);
}

function deleteISdetails(data) {
    let url = api + '/instructor/deleteISdetails';
    return axios.post(url, data);
}
function createinstructorSchedule(data) {
    let url = api + '/instructor/createinstructorSchedule';
    return axios.post(url, data);
}
//to display available instructors to students
function getInstructorsForDates(data) {
    let url = api + '/home/plans';
    return axios.post(url, data);
}

function saveSummary(data) {
    let url = api + '/home/confirm';
    return axios.post(url, data);
}

function getAppointments() {
    let url = api + '/home/appointments';
    return axios.get(url);
}

function getUserdata(data) {
    let url = api + '/home/userdata';
    return axios.post(url,data);
}

function validateEnroll() {
    let url = api + '/home';
    return axios.get(url);
}

function getResources(){
    let url = api + '/home/resources';
    return axios.get(url);
}
function rating(data){
    let url = api + '/home/appointments';
    return axios.post(url,data);
}
function payment(data) {
    let url = api + '/payment/checkout';
    return axios.post(url, data);
}

function getfeedbackForstudent(data) {
    let url = api + '/login/getfeedbackForstudent';
    return axios.post(url, data);
}

function uploadImage(data) {
    let url = 'http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadimagetouserdb';
    return axios.post(url, data);
}
function compareFaces(data) {
    let url = 'http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadandcomparefaces';
    return axios.post(url, data);
}
async function registerOkta(data){
    let url = 'https://dev-930901.okta.com/api/v1/users?activate=true';
    var config = {
        headers: { 'Content-Type': 'application/json',
                    'Accept' : 'application/json' ,
                    'Authorization' : 'SSWS 008XiDB564uZ7F1aKuIsMSB75uicxOvmbr2nQ73GsQ'},
      };

      return await axios.post(url, data, config)
      .then(res => { 
          console.log("Sucess done for response");
          console.log(res);
          return res;
       })
      .catch(err => { handleError(err)
          .then(res => {
                Promise.resolve(res).then(function(value) {
                console.log(value.data.errorCauses[0].errorSummary);
                if((value.data.errorCauses[0].errorSummary).includes("Password requirements were not met")){
                    message.error("Password requirements were not met!")
                }
                else if((value.data.errorCauses[0].errorSummary).includes("An object with this field already exists")){
                    message.error("You are already registered! Please login")
                }
                else if((value.data.errorCauses[0].errorSummary).includes("Username must be in the form of an email address")){
                    message.error("Please enter a valid email address");
                }
          })});
})}
