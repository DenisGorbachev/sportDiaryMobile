import React from 'react';
import {
  Image,
  Text,
  Navigator,
  TouchableHighlight,
  View,
  ListView,
  ScrollView
} from 'react-native';
import moment from 'momentjs';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import style from '../../styles/styles.js';
import { Subheader } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Training extends React.Component {
  constructor(props) {
    super(props);
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
    return (
      <View>
        <View>
          <Subheader text={ex.name} />
        </View>
        <View style={style.headerTableCell}>
          <Text style={style.headerTableCell.row} >N</Text>
          <Text style={style.headerTableCell.row} >Weight</Text>
          <Text style={style.headerTableCell.row} >Repeats</Text>
        </View>
        {sets && sets.map((s,i) => {
          return (
          <View style={style.tableCell}>
            <Text style={style.tableCell.row} >{i+1}</Text>
            <Text style={style.tableCell.row} >{s.weight}</Text>
            <Text style={style.tableCell.row} >{s.repeats}</Text>
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
            <Subheader text={moment(date).format("DD:MM:YYYY")} />
              <ListView
                dataSource={this.state.ds}
                renderRow={this.renderRow}
              >
              </ListView>
          </ScrollView>
        </View>
        <Icon.Button name="keyboard-arrow-left" {...style.btnStyle} onPress={this.goBack}>
          go back
        </Icon.Button>
      </View>
    );
  }
}
