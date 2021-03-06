import React, { Component } from 'react';
import {
    Card, Form, Input, Button, Row, Col, Spin, message
} from 'antd';
import logo from './../../icon.png';
import { withOktaAuth } from '@okta/okta-react';
import Webcam from "react-webcam";
import { connect } from "react-redux";
import { render } from 'react-dom';
import { RESTService } from "../Api/api.js";
import FormData from 'form-data'
import { history } from '../../Helper/history';
var fs = require('fs');



class WebCam extends Component {
  state = {
      loading: false,
      renderWebcam:true,
      videoConstraints:{}
  };
  setRef = webcam => {
    this.webcam = webcam;
  };

  async componentDidMount() {

    let video={}
    video.width= 300;
    video.height= 300;
    video.facingMode= "user";
    this.setState({videoConstraints:video})
    console.log(this.videoConstraints)
}

  componentWillUnmount() {
    
  }
  

  capture = async() => {
    console.log(this.webcam)
    const imageSrc = this.webcam.getScreenshot();

//    const base64 = 'data:image/png;base65,....' // Place your base64 url here.
    fetch(imageSrc)
    .then(res => res.blob())
    .then(blob => {
      const fd = new FormData();
      const image = new File([blob], "filename5.jpeg");
      fd.append('file', image)

      console.log(fd)
      
      this.state.renderWebcam=false;
      this.webcam.stopAndCleanup();

      let closevideo={}
          closevideo.width= 0;
          closevideo.height= 0;
          closevideo.facingMode= "none";
      this.setState({videoConstraints:closevideo})
      history.push('/login');

    //  const API_URL = 'http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadimagetouserdb';
    //   fetch(API_URL, {method: 'POST', body: fd}) 
    //   .then(res => (console.log(res.json()))) 
    //   .then(res => (console.log(res)))
    });
    
    // const API_URL1 = 'http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadandcomparefaces';
    //   fetch(API_URL1, {method: 'POST', body: fd}) 
    //   .then(res => (console.log(res.json()))) 
    //   .then(res => (console.log(res)))
    // });

    

  //http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadandcomparefaces  
      
  //    // Let's upload the file
  //    // Don't set contentType manually → https://github.com/github/fetch/issues/505#issuecomment-293064470
  //   //  const API_URL = 'https://example.com/add_image'
  //   //  fetch(API_URL, {method: 'POST', body: fd)
  //   //  .then(res => res.json()) 
  //   //  .then(res => console.log(res))

  //   data = {}
  //   data.fd = fd

  //   const ufile= <img src={imageSrc} width={100}/>;

  //   const data = new FormData()
  //   data.append('file', imageSrc);
    
      
  //     const fd = new FormData();
  //     fd.append("file", imageSrc);
  //         const data = 
  //         {
  //           //mode: 'no-cors',
  //           method: "POST",
  //           body: fd
  //         }
  // ;


  //   console.log('inside capture',data)
  //   let response=await RESTService.uploadImage(data);
    
    //console.log('inside capture',response)
  };

  render() {
    

    return (
      <div>
     {this.state.renderWebcam ? 
        <div>
        <Webcam
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          videoConstraints={this.state.videoConstraints}/>
        <Button onClick={this.capture}>Capture photo</Button>
        </div>
      :null}
      </div>
    );
  }
}


function mapStateToProps(state) {
  const {simpleReducer} = state;
  return {
      simpleReducer
  };
}
 


export default connect(mapStateToProps)(Form.create()(WebCam));