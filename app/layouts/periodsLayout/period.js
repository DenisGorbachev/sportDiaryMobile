import React from 'react';

import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';
import moment from 'momentjs';
import Training from '../../components/training/training.js';
import CreateTraining from '../../components/training/create-training.js';

export default class Period extends React.Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
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
    })
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
    })
  }

  renderRow(training) {
    const { date } = training;
    const callback = (() => {
      this.openTraining(training)
    }).bind(this)
    return (
      <TouchableHighlight onPress={callback} >
        <Text>
          {moment(date).format("DD:MM:YYYY")}
        </Text>
      </TouchableHighlight>
    )
  }

  render() {
    const { startsAt, exerices, endsAt, _id, trainings } = this.props;
    return (
      <View>
        <Text>
          trainings: { trainings.length }
        </Text>
        <TouchableHighlight onPress={this.createTraining} >
          <Text>create training</Text>
        </TouchableHighlight>

        <ListView
          renderRow={this.renderRow}
          dataSource={this.state.ds}
        >
        </ListView>
        <TouchableHighlight onPress={this.goBack} >
          <Text>
            go Back
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

