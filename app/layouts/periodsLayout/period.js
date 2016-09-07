import React from 'react';

import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
  ScrollView
} from 'react-native';
import moment from 'momentjs';
import Training from '../../components/training/training.js';
import CreateTraining from '../../components/training/create-training.js';
import style from '../../styles/styles.js';
import { Subheader } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';

let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
export default class Period extends React.Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      ds: ds.cloneWithRows(props.trainings || [])
    }
    this.openTraining = this.openTraining.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.createTraining = this.createTraining.bind(this);

  }

  createTraining() {
    const { exercises, _id } = this.props;
    this.props.navigator.push({
      component: CreateTraining,
      passProps: { exercises, _id }
    });
  }

  goBack() {
    this.props.navigator.pop()
  }

  componentWillReceiveProps(nextProps) {
    ds = this.state.ds;
    this.setState({
      ds: ds.cloneWithRows(nextProps.trainings || [])
    });
  }

  openTraining(training) {
    this.props.navigator.push({
      component: Training,
      passProps: training,
    });
  }

  renderRow(training) {
    const { date } = training;
    const callback = (() => {
      this.openTraining(training)
    }).bind(this)
    return (
      <View {...style.listItemStyle} >
        <Icon.Button name="label-outline" {...style.listItemTextStyle} onPress={callback}>
          <Text style={style.listItemColor} >
            {moment(date).format("DD:MM:YYYY")}
          </Text>
        </Icon.Button>
      </View>
    )
  }

  render() {
    const { startsAt, exerices, endsAt, _id, trainings } = this.props;
    return (
      <View>
        <Text>
          trainings: { trainings.length }
        </Text>
        <Icon.Button name="mode-edit" {...style.btnStyle} onPress={this.createTraining}>
          create training
        </Icon.Button>
        <Subheader text="Training list"/>
        <View style={{maxHeight: 300}} >
          <ScrollView>
            <ListView
              renderRow={this.renderRow}
              dataSource={this.state.ds}
            >
            </ListView>
          </ScrollView>
        </View>
        <Icon.Button name="keyboard-arrow-left" {...style.btnStyle} onPress={this.goBack}>
          go back
        </Icon.Button>
      </View>
    )
  }
}
