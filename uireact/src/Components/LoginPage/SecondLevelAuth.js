import React, { Component } from 'react';
import {
    Card, Form, Input, Button, Row, Col, Spin, message
} from 'antd';
import logo from './../../icon.png';
import { withOktaAuth } from '@okta/okta-react';
import Webcam from "react-webcam";
import { Jumbotron} from 'react-bootstrap'; 
import { history } from '../../Helper/history';
import { RESTService } from "../Api/api.js";
import base64 from 'react-native-base64'

export default withOktaAuth(

    
class SecondLevelAuth extends Component {

    
    state = {
        authenticated: null ,
        loading: false,
        showcam:false,
        videoConstraints:{},
        imageName:""
    };
    setRef = webcam => {
        this.webcam = webcam;
      };

      async componentDidMount() {

        const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
        // console.log("idToken.idToken.claims");
        // console.log(idToken);
        let data={}
        data.email= idToken.idToken.claims.email;
        // console.log(data);
        let userDetails=RESTService.octaUserData(data)
        
        let imageNameStored=userDetails.data.result[0].imageName;
        this.setState({imageName:imageNameStored})
        
    }

    capture = async() => {
        this.setState({loading:true});
        const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
        
        let data={}
        data.email= idToken.idToken.claims.email;
        let userDetails= await RESTService.octaUserData(data)

        let imageNameStored=userDetails.data.result[0].userImage;
        //this.setState({imageName:imageNameStored});
        this.state.imageName=imageNameStored;

        const imageSrc = this.webcam.getScreenshot();
        
        console.log(imageSrc)
        fetch(imageSrc)
        .then(res => res.blob())
        .then( async(blob) => {
          const fd = new FormData();
          const image = new File([blob], Date.now()+".jpeg");
          fd.append('file', image)

          var a=image.toString('Base64');
          
          this.state.renderWebcam=false;
          let video={}
          video.width= 1;
          video.height= 1;
          video.facingMode= "user";
          this.setState({videoConstraints:video});

            const data = new FormData()
            data.append('file', image, image.name);
            
            console.log("Uploading... " + image.name);
           let res= await RESTService.uploadToRekognitionDB(data);
           console.log(res);
        this.setState({showcam:false});
        this.setState({loading:false});
           if(res.data.Message==='FaceMatched'){
                message.success('Authenticated successfully');
                this.props.authService.login('/home');
            }
            else{
                message.error('Authetication failed');
            }        
        });
    

      };

      captureDummy = async ()=>{
        const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
        let data={}
        data.email= idToken.idToken.claims.email;
        console.log(data);
        let userDetails= await RESTService.octaUserData(data)
        this.props.authService.login('/home');

      }
    
    showcamera = () => {
        this.setState({showcam:true});
        let video={}
        video.width= 400;
        video.height= 400;
        video.facingMode= "user";
        this.setState({videoConstraints:video})
    };
    hidecam = () => {
        this.setState({showcam:false});
        this.webcam.stopAndCleanup();
    };
    
    back = () => {
        this.props.authService.login('/');
    };

    
    async componentDidMount() {


    }


    checkAuthentication = async () => {
      if (this.props.authState.isAuthenticated) {
        this.setState({ authenticated : this.props.authState.isAuthenticated});
      }
    };

    async componentDidMount() {
      this.checkAuthentication();
    }

    // async componentDidUpdate() {
    //   this.checkAuthentication();
    // }

    login = async () => {
        this.props.authService.login('/home');
    };

    logout = async () => {
        this.props.authService.logout('/');
    };


    render() {

        // if (this.state.authenticated === null) return null;
       

        const mainContent = this.state.showcam ?
        (
        <div>
        
            <div className="cards" style={{ display: 'flex', alignItems:'center', height: '20%',paddingLeft : '30%' }}>
                <table>
                    <tr>
                    <td style={{ padding: '70px' , paddingTop: '20px', paddingBottom: '20px'}}>
                        <Jumbotron style={{ width: '40rem' , height: '40rem' }}>
                        <Row type="flex" justify="space-around" align="middle" className="fullHeight" >    
                        <Webcam
                        audio={false}
                        ref={this.setRef}
                        mirrored={true}
                        screenshotFormat="image/jpeg"
                        videoConstraints={this.state.videoConstraints}/>
                        </Row>
                        <Row type="flex" justify="space-around"  className="fullHeight" >
                        <Button type="primary"  onClick={this.capture} loading={this.state.loading}>
                            Click Picture(Beta)
                        </Button>
                        <Button type="primary"  onClick={this.hidecam} loading={this.state.loading}>
                            Cancel
                        </Button>
                        </Row>
                        </Jumbotron>
                        </td>
                    </tr>
                       
                </table>
            </div>
        </div>
        
        
        )
        :
        (
        
            <div>
            <div className="cards" style={{ display: 'flex', alignItems:'center', height: '20%',paddingLeft : '30%' }}>
                <table>
                    <tr>
                    <td style={{ padding: '70px' , paddingTop: '20px', paddingBottom: '20px'}}>
                        <Jumbotron style={{ width: '40rem' , height: '20rem' }}>
                            <h1>Second Level Authentication</h1>
                            <br/>
                            <Button type="primary"  className="login-form-button" onClick={this.showcamera}>
                            Take Picture
                        </Button>
                        <Button type="link"  onClick={this.back}>
                            Back
                        </Button>
                        </Jumbotron>
                        </td>
                    </tr>
                       
                </table>
            </div>
        </div>);

          return (
            <div>
              {mainContent}
            </div>
          );
    }
}
);