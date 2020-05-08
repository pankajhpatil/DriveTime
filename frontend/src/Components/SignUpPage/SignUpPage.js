import React, { Component } from 'react';
import {
    Form, Icon, Input, Button, Row, Col, Spin, message, Select
} from 'antd';

import { history } from '../../Helper/history';
import { RESTService } from "../Api/api.js";
import { connect } from "react-redux";
import WebCamComponent from "../LoginPage/webCamCapture";
import Webcam from "react-webcam";

class SignUpPage extends Component {
    state = {
        loading: false,
        showcam:false,
        videoConstraints:{},
        imageSrc:null,
        imageName:""
    };
    setRef = webcam => {
        this.webcam = webcam;
      };

      async componentDidMount() {
        
    }

    capture = async() => {
        
        const imgSrc = this.webcam.getScreenshot();
        this.state.imageSrc=imgSrc;
        this.setState({showcam:false});
        message.success('Photo Captured. It will be moved to storage once registration is successful');
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

    
    async componentDidMount() {


    }

// `username`, `password`, `firstname`, `lastname`,`email`,`modifieddate`,`phone`

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({loading: true});
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                // this.setState({loading: true});
                console.log('Received values of form: ', values);
                //await api call

                this.state.imageName=values.uname+".jpeg";

                let data = {};


                data.username = values.uname;
                data.password = values.password;
                data.firstname = values.fname;
                data.lastname = values.lname;
                data.email = values.email;
                data.phone = values.phone;
                data.usertype= values.usertype;
                data.userImage= this.state.imageName;
                console.log('Before register')
                console.log(this.state.imageName)

                try {


                        await RESTService.register(data);
                    
                    
                    
                        
                        const imageSrc = this.state.imageSrc;

                        fetch(imageSrc)
                        .then(res => res.blob())
                        .then( async(blob) => {
                        const fd = new FormData();
                        const image = new File([blob], this.state.imageName);
                        fd.append('file', image)
                        this.state.renderWebcam=false;

                        console.log(fd);

                        const API_URL = 'http://ec2-54-67-76-112.us-west-1.compute.amazonaws.com:8080/api/uploadimagetouserdb';

                        await  fetch(API_URL, {method: 'POST', body: fd}) 
                        .then(res => (console.log(res.json()))) 
                        .then(res => (console.log(res)));

                        });
        
                    message.success('Registered Successfully');

                    history.push('/login');
                }
                catch (err) {
                    this.setState({loading: false});
                    message.error('User name not available!');
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


                                <Form.Item label="User Name" className="marginBottom0">
                                    {getFieldDecorator('uname', {
                                        rules: [{required: true, message: 'Please enter your User Name!'}],
                                    })(
                                        <Input prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="User Name"/>
                                    )}
                                </Form.Item>

                                <Form.Item label="e-mail" className="marginBottom0">
                                    {getFieldDecorator('email', {
                                        rules: [{required: true, message: 'Please enter your email!'}],
                                    })(
                                        <Input prefix={<Icon type="global" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               placeholder="email"/>
                                    )}
                                </Form.Item>

                                <Form.Item label="password" className="marginBottom0">
                                    {getFieldDecorator('password', {
                                        rules: [{required: true, message: 'Please input your Password!'}],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                               type="password" placeholder="Password"/>
                                    )}
                                </Form.Item>

                                <Form.Item label="Phone" className="marginBottom0">
                                    {getFieldDecorator('phone', {
                                        rules: [{required: true, message: 'Please enter your Phone number!'}],
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