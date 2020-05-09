import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, Row, Col, Spin, message, Select
} from 'antd';
// const {  QuestionCircleOutlined  } = icons;
import { history } from '../../Helper/history';
import { RESTService } from "../Api/api.js";
import { connect } from "react-redux";
import WebCamComponent from "../LoginPage/webCamCapture";
import Webcam from "react-webcam";

class SignUpPage extends Component {
    state = {
        loading: false,
        showcam:false,
        videoConstraints:{}
    };
    setRef = webcam => {
        this.webcam = webcam;
      };

    async componentDidMount() {
        
    }

    capture = async() => {
        
        const imageSrc = this.webcam.getScreenshot();
        fetch(imageSrc)
        .then(res => res.blob())
        .then( async(blob) => {
          const fd = new FormData();
          const image = new File([blob], Date.now()+".jpeg");
          fd.append('file', image)
          this.state.renderWebcam=false;
          
         const API_URL = 'http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadimagetouserdb';

         await  fetch(API_URL, {method: 'POST', body: fd}) 
          .then(res => (console.log(res.json()))) 
          .then(res => (console.log(res)));

          this.setState({showcam:false});
          message.success('Photo uploaded successfuly');

        
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

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({loading: true});
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // this.setState({loading: true});
                console.log('Received values of form: ', values);
                //await api call

                if(values.password !== values.confirmPassword){

                    this.setState({loading: false});
                    message.error('Password did not match!');
                }
                else{

                    let data = {};
                    data.username = values.email;
                    data.password = values.password;
                    data.firstname = values.fname;
                    data.lastname = values.lname;
                    data.email = values.email;
                    data.phone = values.phone;
                    data.usertype= values.usertype;

                    try {
                        // await RESTService.register(data);

                        let profileData = {};
                        profileData.firstName = values.fname;
                        profileData.lastName = values.lname;
                        profileData.email = values.email;
                        profileData.login = values.email;
                        profileData.mobilePhone = values.phone;

                        let passwordData = {}
                        passwordData.value = values.password;

                        let credentialsData = {};
                        credentialsData.password  = passwordData;

                        let oktaData = {};
                        oktaData.profile = profileData;
                        oktaData.credentials = credentialsData;

                        let response = await RESTService.registerOkta(oktaData); 
                        // console.log("Sucess response")
                        // console.log(response)

                        if(response){
                            message.success('Registered Successfully');
                            history.push('/login');
                        }
                        else{
                            this.setState({loading: false});
                        }
                        // console.log(response);
                    }
                    catch (err) {
                        this.setState({loading: false});
                        message.error('Email already registered!');
                    }
                }
            }
            else {
                this.setState({loading: false});
                message.error('Incomplete information');
            }
        });
    }

    render() {


        const {getFieldDecorator} = this.props.form;
        const tips = 'Password requirements: at least 8 characters, a lowercase letter, an uppercase letter, a number, no parts of your username. Your password cannot be any of your last 4 passwords.';
        const cambutton = this.state.showcam ?
                (<div>
                <div>
                <Webcam
                audio={false}
                ref={this.setRef}
                mirrored={true}
                screenshotFormat="image/jpeg"
                videoConstraints={this.state.videoConstraints}/>
                </div>
                <Row type="flex" justify="space-around" align="middle" className="fullHeight" >
                <Button type="primary" className="login-form-button" onClick={this.capture} >
                    Click Picture(Beta)
                </Button>
                <Button type="primary" className="login-form-button" onClick={this.hidecam}>
                    Cancel
                </Button>
                </Row>
                </div>)
                :
                (<div>
                    <Button type="primary"  className="login-form-button" onClick={this.showcam}>
                        Take Picture
                    </Button>
                </div>)

        return (
            <div className="Login">
                <Row type="flex" justify="space-around" align="middle" className="fullHeight">
                    <Col span={7} className="boxShadow">
                        <Spin spinning={this.state.loading} delay={500}>
                            <h2 className="alignCenter">Login</h2>
                            <Form onSubmit={this.handleSubmit} className="login-form">

                                <Form.Item label="First name" className="marginBottom0">
                                    {getFieldDecorator('fname', {
                                        rules: [{required: true, message: 'Please enter your First Name!'}],
                                    })(
                                        <Input prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="First name"/>
                                    )}
                                </Form.Item>

                                <Form.Item label="Last name" className="marginBottom0">
                                    {getFieldDecorator('lname', {
                                        rules: [{required: true, message: 'Please enter your Last Name!'}],
                                    })(
                                        <Input prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="Last name"/>
                                    )}
                                </Form.Item>

                                <Form.Item label="e-mail" type ="email" className="marginBottom0">
                                    {getFieldDecorator('email', {
                                        rules: [{required: true, message: 'Please enter your email!'}],
                                    })(
                                        <Input prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="email"/>
                                    )}
                                </Form.Item>
                                <Form.Item label="Password" name="password" className="marginBottom0" help = {tips}>
                                    {getFieldDecorator('password', {
                                        rules: [{required: true, message: 'Please input your Password!'}],
                                    })(
                                        <Input.Password />
                                    )}
                                </Form.Item>

                                <Form.Item name="confirm" label="Confirm Password" className="marginBottom0" >
                                {getFieldDecorator('confirmPassword', {
                                        rules: [{required: true, message: 'Please confirm your Password!'}],
                                    })(
                                        <Input.Password />
                                    )}
                                </Form.Item> 

                                <Form.Item label="Mobile" className="marginBottom0">
                                    {getFieldDecorator('phone', {
                                        rules: [{required: true, message: 'Please enter your Mobile number!'}],
                                    })(
                                        <Input prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="Phone"/>
                                    )}
                                </Form.Item>
                                <Form.Item label="User Type" className="marginBottom0">
                                    {getFieldDecorator('usertype', {
                                        rules: [{required: true, message: 'Please select the User Type!'}],
                                    })(
                                   <Select prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="User Type">
                                                          
                                    <option value="student">Student</option>
                                    <option value="instructor">Instructor</option>
                        
                                    </Select>
                                    )}
                                
                                </Form.Item>
                                <Form.Item className="alignCenter" style={{marginBottom: 0, marginTop: 5}}>
                                    {cambutton}
                                </Form.Item>

                                <Form.Item className="alignCenter" style={{marginBottom: 0, marginTop: 5}}>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Register
                                </Button>
                                </Form.Item>
                                

                                <Form.Item className="alignCenter" style={{lineHeight: 0}}>
                                    or <a href="/login">Sign In</a>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </Col>
                
                </Row>
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

export default connect(mapStateToProps)(Form.create()(SignUpPage));