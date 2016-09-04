import React from 'react';
import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';
import moment from 'momentjs';
import  Meteor, { createContainer } from 'react-native-meteor';
import TabNavigator from 'react-native-tab-navigator';
import NewPeriod from './new-period.js';
import PeriodContainer from './period-container.js';
class PeriodsList extends React.Component {
  constructor(props) {
    super(props);
    this._navigate = this._navigate.bind(this);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds.cloneWithRows(props.periods || [])
    }
    this.openPeriod = this.openPeriod.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    ds = this.state.ds;
    this.setState({
      ds: ds.cloneWithRows(nextProps.periods || [])
    });
  }


  _navigate() {
    this.props.navigator.push({ component: NewPeriod })
  }

  openPeriod(p) {
    this.props.navigator.push({
      component: PeriodContainer,
      passProps: p,
    })
  }


  renderRow(p) {
    return (
      <View>
        <TouchableHighlight onPress={this.openPeriod.bind(null, p)} >
          <Text>
            {moment(p.startsAt).format("DD:MM:YYYY")}
              - {moment(p.endsAt).format("DD:MM:YYYY")}
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    const { periods } = this.props;
    return (
      <View>
        <Text>Periods List</Text>
        <Text>You have </Text>
          <ListView
            dataSource={this.state.ds}
            renderRow={this.renderRow}
          >
          </ListView>
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

