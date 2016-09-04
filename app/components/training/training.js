import React from 'react';
import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
} from 'react-native';
import moment from 'momentjs';

export default class Training extends React.Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds.cloneWithRows(props.exercises && props.exercises || [])
    }
    this.goBack = this.goBack.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    ds = this.state.ds;
    this.setState({
      ds: ds.cloneWithRows(nextProps.training.exercises || [])
    });
  }

  renderRow(ex) {
    return (
      <View>
        <Text>
          {ex.name}
        </Text>
      </View>
    )
  }

  goBack() {
    this.props.navigator.pop();
  }

  render() {
    const { date } = this.props;
    return (
      <View>
        <Text>{moment(date).format("DD:MM:YYYY")}</Text>
        <Text>Exercises:</Text>
          <ListView
            dataSource={this.state.ds}
            renderRow={this.renderRow}
          >
          </ListView>
        <TouchableHighlight onPress={ this.goBack }>
          <Text>Go back</Text>
        </TouchableHighlight>
      </View>


    );
  }
}

