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
        console.log("idToken.idToken.claims");
        console.log(idToken);
        let data={}
        data.email= idToken.idToken.claims.email;
        console.log(data);
        let userDetails=RESTService.oAuthlogin(data)
        
        let imageNameStored=userDetails.data.result[0].imageName;
        this.setState({imageName:imageNameStored})
        
    }

    capture = async() => {
        this.setState({loading:true});
        console.log('inside capture');
        const idToken = JSON.parse(localStorage.getItem('okta-token-storage'));
        console.log("idToken.idToken.claims");
        console.log(idToken);
        let data={}
        data.email= idToken.idToken.claims.email;
        console.log(data);
        let userDetails= await RESTService.octaUserData(data)
        console.log(userDetails)
        console.log(userDetails.data.result.length)

        let imageNameStored=userDetails.data.result[0].userImage;
        //this.setState({imageName:imageNameStored});
        this.state.imageName=imageNameStored;
        console.log('imageSrc',this.state.imageName)

        const imageSrc = this.webcam.getScreenshot();

        console.log(imageSrc)
        fetch(imageSrc)
        .then(res => res.blob())
        .then( async(blob) => {
          const fd = new FormData();
          const image = new File([blob], Date.now()+".jpeg");
          fd.append('file', image)
          this.state.renderWebcam=false;
          
        const API_URL = 'http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadandcomparefaces';
        console.log('starting API call',fd)
         await  fetch(API_URL, {method: 'POST', body: fd}) 
          .then(
            //   res => (console.log(res.json()))
            async (res) => {
            // console.log(Promise.resolve(res.json()));
            

           let value= await Promise.resolve(res.json()).then(function(value) {
                console.log(value.file1); // "Success"
                console.log(value.file2); // "Success"
                console.log(value.similarity); // "Success"
                if(value.file2 && value.similarity && value.similarity > 98 ){
                    console.log('inside promise',value.file2)
                    return value.file1
                }else{
                    
                    return 'error'
                }
                

        }); 
        this.setState({showcam:false});
        this.setState({loading:false});
        

        console.log('outside promise returned value' ,value);
        console.log('user stored value value' ,this.state.imageName);
        console.log((value===this.state.imageName))
        if(value === 'error'){
            message.error('Authetication failed');
        }else{
            if(value===this.state.imageName){

            message.success('Authenticated successfully');
            this.props.authService.login('/home');
        }else{
            message.error('Authetication failed');
        }

        }

          }
              
              
              );

          

        
        });
    
        
    
      //http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadandcomparefaces  
          
      //    // Let's upload the file
      //    // Don't set contentType manually → https://github.com/github/fetch/issues/505#issuecomment-293064470
      //   //  const API_URL = 'https://example.com/add_image'
      //   //  fetch(API_URL, {method: 'POST', body: fd)
      //   //  .then(res => res.json()) 
      //   //  .then(res => console.log(res))

      };
    
    showcam = () => {
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
      console.log('login status'+this.props.authState.isAuthenticated)
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
                            <h1>Second level authetication</h1>
                            <br/>
                            <Button type="primary"  className="login-form-button" onClick={this.showcam}>
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