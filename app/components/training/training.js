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
import { Cell, Section, TableView } from 'react-native-tableview-simple';

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
    const { sets } = ex;
    const style = {
      rows: {
        flexDirection: 'row',
        justifyContent: 'space-around'
      }
    }
    return (
      <View>
        <View>
          <Text>
            {ex.name}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
          <Text style={{width: 50}} >N</Text>
          <Text style={{width: 50}} >Weight</Text>
          <Text style={{width: 50}} >Repeats</Text>
        </View>
        {sets && sets.map((s,i) => {
          return (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
            <Text style={{width: 50}} >{i+1}</Text>
            <Text style={{width: 50}} >{s.weight}</Text>
            <Text style={{width: 50}} >{s.repeats}</Text>
          </View>
          )
        })}
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
        <View style={{maxHeight: 350}}>
          <ScrollView>
            <Text>{moment(date).format("DD:MM:YYYY")}</Text>
            <Text>Exercises:</Text>
              <ListView
                dataSource={this.state.ds}
                renderRow={this.renderRow}
              >
              </ListView>
          </ScrollView>
        </View>
        <TouchableHighlight onPress={ this.goBack }>
          <Text>Go back</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

