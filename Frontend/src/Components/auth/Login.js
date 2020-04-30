// import React, { Component } from 'react';
// import { Redirect } from 'react-router-dom';
// import SignInWidget from './SignInWidget';
// import { withOktaAuth } from '@okta/okta-react';

// export default withOktaAuth(
//   class Login extends Component {
//     constructor(props) {
//       super(props);
//       this.login = this.login.bind(this);
//       this.logout = this.logout.bind(this);
//     }
//     async login() {
//       this.props.authService.login('/home');
//     }
   
//     async logout() {
//       this.props.authService.logout('/');
//     }

//     componentDidUpdate() {
//       console.log('In login page');
//     }

//     render() {

//       // if (this.props.authState.isPending) return <div>Loading...</div>;
//       return this.props.authState.isAuthenticated ?
//       (
//         <Redirect to={{ pathname: '/home' }} />
//       ) : (
//         <SignInWidget
//           baseUrl={this.props.baseUrl}
//           onSuccess={this.onSuccess}
//           onError={this.onError}
//         />
//       );
//     }
//   }
// );
