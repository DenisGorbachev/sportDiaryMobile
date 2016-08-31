import React from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
// import settings from './config/settings';
import { Text } from 'react-native';
import Signin from './components/signin';

// Meteor.connect(settings.METEOR_URL);
Meteor.connect('ws://localhost:3000/websocket')

class App extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }
    render() {
      const { status, user, loggingIn } = this.props;
      if (status.connected === false || loggingIn) {
        // return <Text>connecting...</Text>
        return <Signin />
      }
        return <Text>{this.props.status.status}!!!</Text>;
    }
}

export default createContainer(() => {
  return {
    status: Meteor.status(),
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn(),
  };
}, App);
