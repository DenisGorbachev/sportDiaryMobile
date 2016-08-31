import React from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
// import settings from './config/settings';
import { Text } from 'react-native';


// Meteor.connect(settings.METEOR_URL);
Meteor.connect('ws://localhost:3000/websocket')

class App extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = '';
    }
    render() {
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
