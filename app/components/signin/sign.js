import React from 'react';
import { Image, Text, Navigator } from 'react-native';
import Signin from './signin.js';
import Signup from './signup.js';

class Sign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signin: true
    };
    this.toggleSignin = this.toggleSignin.bind(this);
  }

  toggleSignin() {
    this.setState({ signin: !this.state.signin })
  }

  render() {
    const { signin } = this.state;
    if (signin) {
      return <Signin toggleSignin={this.toggleSignin} />
    };
    return <Signup toggleSignin={this.toggleSignin} />
  }
}

export default Sign;
