import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route, useHistory, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import HomePage from './Components/HomePage/homePage'
import LoginPage from './Components/LoginPage/loginPage'
import SignUpPage from './Components/SignUpPage/SignUpPage'
import { history } from './Helper/history.js';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import Welcome from './Components/LoginPage/Welcome'

class App extends Component {

    state = {
        isLoggedIn: false
    };
    componentDidMount() { }
    

    render() {
        let isLoggedIn = this.state.isLoggedIn;

        return (
            <div className="App">
                <Router history={history}>
                    <Security
                    issuer="https://dev-930901.okta.com/oauth2/default"
                    client_id="0oaah3hwpAyoyRLpo4x6"
                    redirect_uri={window.location.origin + '/implicit/callback'}
                    >
                    <div>
                        <div>
                        <Route path="/" exact={true} component={Welcome} />
                        <SecureRoute path="/home" exact={true} component={HomePage} />
                        <Route path="/implicit/callback" component={LoginCallback} />
                        <Route path="/signUp" component={SignUpPage} />
                        </div>
                    </div>
                    </Security>
                </Router>
                 {/* <Router history={history}>
                    <Switch>
                        {!isLoggedIn ? <Route exact path="/" component={LoginPage}/> :
                            <Route exact path="/" component={HomePage}/>}
                        {!isLoggedIn ? <Route exact path="/signUp" component={SignUpPage}/> :
                            <Route exact path="/signUp" component={HomePage}/>}
                        {!isLoggedIn ? <Route exact path="/login" component={LoginPage}/> :
                            <Route exact path="/login" component={HomePage}/>}
                        {!isLoggedIn ? <Route path="/home" component={HomePage}/> :
                            <Route path="/home" component={LoginPage}/>}
                    </Switch>
                </Router>  */}
           </div>
        )
    }
}

function mapStateToProps(state) {
    const {simpleReducer} = state;
    return {
        simpleReducer
    };
}

export default connect(mapStateToProps)(App);
