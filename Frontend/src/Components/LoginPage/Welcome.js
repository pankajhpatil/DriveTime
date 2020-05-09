import React, { Component } from 'react';
import {
    Card, Form, Input, Button, Row, Col, Spin, message
} from 'antd';
import logo from './../../icon.png';
import { withOktaAuth } from '@okta/okta-react';
import LexChat from '../Chatbot/Chatbot'

export default withOktaAuth(
class WelcomePage extends Component {

    state = { authenticated: null };

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


        const mainContent = this.state.authenticated ? (
            <div className="Logout">
                <Row type="flex" justify="space-around" align="middle" className="fullHeight" >
                    <Col span={7} className="boxShadow" align="center" >
                    <img src={logo} alt="DriveTime" 
                                style={{ position:'relative' , width:'30vh',marginTop:'10px'}}/>
                        <Card className="alignCenter" bordered={false}>
                        <Button type="primary" onClick={this.logout}>Logout</Button>
                        </Card>
                    </Col>
                </Row>
            </div>
          ) : (
            <div className="Login">
                <Row type="flex" justify="space-around" align="middle" className="fullHeight" >
                    <Col span={7} className="boxShadow" align="center" >
                    <img src={logo} alt="DriveTime" 
                                style={{ position:'relative' , width:'30vh',marginTop:'10px'}}/>
                        <Card className="alignCenter" bordered={false}>
                        <Button type="primary" onClick={this.login}>Login</Button>
                        <br/>
                        <a href="/signUp">Register now!</a>
                        </Card>
                    </Col>
                </Row>
                <LexChat botName="drivetime"
                 IdentityPoolId="us-east-1:77d13f41-a183-49e7-98af-fea9fcd1a67e"
                 placeholder="Please enter 'book an instructor!'"
                 style={{position: 'absolute'}}
                 backgroundColor="#FFFFFF"
                 height = {430}
                 region="us-east-1"
                 headerText="Chat with our drivetime bot" />
            </div>
          );
          return (
            <div>
              {mainContent}
            </div>
          );
    }
}
);