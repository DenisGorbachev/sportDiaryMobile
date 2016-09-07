import React from 'react';
import {
  Image,
  Text,
  Navigator,
  TouchableHighlight,
  View,
  ListView,
  ScrollView,
} from 'react-native';
import moment from 'momentjs';
import  Meteor, { createContainer } from 'react-native-meteor';
import TabNavigator from 'react-native-tab-navigator';
import NewPeriod from './new-period.js';
import PeriodContainer from './period-container.js';

import style from '../../styles/styles.js';
import { Subheader } from 'react-native-material-design';

import Icon from 'react-native-vector-icons/MaterialIcons';
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
    this.logout = this.logout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    ds = this.state.ds;
    this.setState({
      ds: ds.cloneWithRows(nextProps.periods || [])
    });
  }


  logout() {
    Meteor.logout();
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
      <View {...style.listItemStyle} >
        <Icon.Button name="label-outline" {...style.listItemTextStyle} onPress={this.openPeriod.bind(null, p)}>
          <Text style={style.listItemColor} >
          {moment(p.startsAt).format("DD:MM:YYYY")}
          - {moment(p.endsAt).format("DD:MM:YYYY")}
          </Text>
        </Icon.Button>
      </View>
    )
  }

  render() {
    const { periods } = this.props;
    return (
      <View>
        <Icon.Button name="vpn-key" {...style.btnStyle} onPress={this.logout}>
          Logout
        </Icon.Button>
        <Subheader text="Periods List"/>
        <View style={{maxHeight: 300}}>
          <ScrollView>
            <ListView
              dataSource={this.state.ds}
              renderRow={this.renderRow}
            >
            </ListView>
          </ScrollView>
        </View>
        <Icon.Button name="add" {...style.btnStyle}  onPress={this._navigate }>
          Create New Period
        </Icon.Button>
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

