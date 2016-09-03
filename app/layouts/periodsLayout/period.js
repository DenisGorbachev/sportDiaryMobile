import React from 'react';

import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';


export default class Period extends React.Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.navigator.pop()
  }

  render() {
    return (
      <View>
        <Text>
          Period Component { }
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

