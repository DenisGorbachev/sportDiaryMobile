import React from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import { Text } from 'react-native';
import Sign from './components/signin/sign.js';
import Periods from './layouts/periodsLayout/periods.js'

Meteor.connect('ws://sportdiary.herokuapp.com/websocket', { autoReconnect: true })

class App extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }
    render() {
      const { status, user, loggingIn } = this.props;
      if (!Meteor.user()) {
        return <Sign />
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
