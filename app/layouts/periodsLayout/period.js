import React from 'react';

import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';
import moment from 'momentjs'

export default class Period extends React.Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.navigator.pop()
  }

  render() {
    const { startsAt, exerices, endsAt, _id, trainings } = this.props;
    return (
      <View>
        <Text>
          Period Component {_id}
          trainings: { trainings.length }
        </Text>
        <TouchableHighlight onPress={this.goBack} >
          <Text>
            go Back
          </Text>
        </TouchableHighlight>
      </View>
    )
  }
}

