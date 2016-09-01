import React from 'react';
import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
} from 'react-native';
import moment from 'momentjs';
import  Meteor, { createContainer } from 'react-native-meteor';
import TabNavigator from 'react-native-tab-navigator';
import NewPeriod from './new-period.js';

class PeriodsList extends React.Component {
  constructor(props) {
    super(props);
    this._navigate = this._navigate.bind(this)

  }
  _navigate() {
    this.props.navigator.push({ component: NewPeriod })
  }

  render() {
    const { periods } = this.props;
    return (
      <View>
        <Text>Periods List</Text>
        <Text>You have </Text>
        {periods.map (p => (
          <Text>
            {moment(p.startsAt).format("DD:MM:YYYY")}
              - {moment(p.endsAt).format("DD:MM:YYYY")}
          </Text>))}
        <TouchableHighlight onPress={ this._navigate }>
          <Text>Create New Period</Text>
        </TouchableHighlight>
      </View>


    );
  }
}

export default createContainer(() => {
  const userId = Meteor.userId();
  const periodsHandle = Meteor.subscribe('periodsByUser', userId);
  const periods = periodsHandle.ready() ? Meteor.collection('periods').find({}) : []

  return {
    periods
  };
}, PeriodsList);

