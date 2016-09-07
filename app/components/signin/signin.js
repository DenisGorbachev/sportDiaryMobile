import React from 'react';
import { LayoutAnimation } from 'react-native';
import Meteor, { Accounts, createContainer } from 'react-native-meteor';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';

import style from '../../styles/styles.js';
import { Subheader } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Signup from './signup.js';
class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home',
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
    this.signup = this.signup.bind(this);
  }

  signup() {
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
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
       return this.setState({ error: err.reason });
      }
      this.setState({ error: null });
    });
  }

  render() {
    const { error } = this.state;
    return (
      <View>
        <Text style={{fontSize: 20}} >Signin:</Text>
        {error? <Text style={style.error}>{error}</Text> : null}
          <Text>
            Enter email
          </Text>
          <TextInput
            style={style.textInput}
            onChangeText={this.setEmail}
            value={this.state.text}
          />
          <Text>
            Enter password
          </Text>
          <TextInput
            style={style.textInput}
            onChangeText={this.setPassword}
            value={this.state.text}
          />

          <View style={style.saveBtn} >
            <Icon.Button name="done" {...style.btnStyle} onPress={this._onPressButton}>
              submit
            </Icon.Button>
          </View>

          <View style={style.saveBtn} >
            <Icon.Button name="account-box" {...style.btnStyle} onPress={this.signup}>
              signup
            </Icon.Button>
          </View>

          {Meteor.user() ? <Text>Meteor.userId()</Text>: null}
      </View>
    );
  }
}

export default Signin;
