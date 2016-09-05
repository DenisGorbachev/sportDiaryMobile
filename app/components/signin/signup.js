import React from 'react';
import { LayoutAnimation } from 'react-native';
import Meteor, { Accounts, createContainer } from 'react-native-meteor';
import Signin from './signin.js';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home',
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this.signin = this.signin.bind(this);
  }

  signin() {
    this.props.toggleSignin()
  }

  setEmail(email) {
    this.setState({ email: email });
  }

  setPassword(password) {
    this.setState({ password: password });
  }

  _onPressButton() {
    const { email, password } = this.state;
    if (!email || !password){
      return this.setState({error: 'Invalid data...'});
    }
    Accounts.createUser(email, password, (err) => {
      if (err) {
       return this.setState({ error: err.reason });
      }
      this.setState({ error: null });
    });
  }

  render() {
    const style= {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1
    }
    const { error } = this.state;
    return (
      <View>
        {error? <Text>{error}</Text> : null}
          <Text>
            Enter email
          </Text>
          <TextInput
            style={style}
            onChangeText={this.setEmail}
            value={this.state.text}
          />
          <Text>
            Enter password
          </Text>
          <TextInput
            style={style}
            onChangeText={this.setPassword}
            value={this.state.text}
          />
          <TouchableHighlight onPress={this._onPressButton}>
            <Text> Submit </Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={this.signin}>
            <Text> signin </Text>
          </TouchableHighlight>

          {Meteor.user() ? <Text>Meteor.userId()</Text>: null}
      </View>
    );
  }
}

export default Signup;
