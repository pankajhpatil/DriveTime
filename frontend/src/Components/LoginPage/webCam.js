import React, { Component } from 'react';
import {
    Card, Form, Input, Button, Row, Col, Spin, message
} from 'antd';
import logo from './../../icon.png';
import { withOktaAuth } from '@okta/okta-react';
import Webcam from "react-webcam";
import { connect } from "react-redux";
import { render } from 'react-dom';


class WebCam extends Component {
  state = {
      loading: false,
  };
  setRef = webcam => {
    this.webcam = webcam;
  };
  

  capture = () => {
    console.log('inside capture')
    const imageSrc = this.webcam.getScreenshot();
    console.log('inside capture',imageSrc)
  };

  render() {
    const videoConstraints = {
      width: 400,
      height: 400,
      facingMode: "user"
    };

    return (
      <div>
        <Webcam
          audio={false}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}/>
        <Button onClick={this.capture}>Capture photo</Button>
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