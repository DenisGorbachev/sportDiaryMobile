import React from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight
} from 'react-native';
class Signin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Home',
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this._onPressButton = this._onPressButton.bind(this);
  }

  setEmail(text) {
    this.setState({ email: text });
  }

  setPassword(password) {
    this.setState({ password: text });
  }

  _onPressButton() {

  }

  render() {
    const style= {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1
    }
    return (
      <View>
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
      </View>
    );
  }
}

export default Signin;
