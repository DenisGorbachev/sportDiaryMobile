import React from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
// import settings from './config/settings';
import { Text } from 'react-native';
import Signin from './components/signin';
import Periods from './layouts/periodsLayout/periods.js'
// Meteor.connect(settings.METEOR_URL);
// Meteor.connect('ws://localhost:3000/websocket', { autoReconnect: true })
Meteor.connect('ws://192.168.31.22:3000/websocket', { autoReconnect: true })


class App extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }
    render() {
      const { status, user, loggingIn } = this.props;
      // if (status.connected === false || loggingIn) {
        // return <Text>connecting...</Text>
      if (!Meteor.user()) {
        return <Signin />
      }
        return <Periods />
    }
}

export default createContainer(() => {
  return {
    status: Meteor.status(),
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn(),
  };
}, App);
