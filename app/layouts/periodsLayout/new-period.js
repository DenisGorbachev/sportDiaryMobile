import React from 'react';
import {
  Image,
  Text,
  Navigator,
  TouchableHighlight,
  View,
  TextInput,
  ListView,
  ScrollView
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import DatePicker from 'react-native-datepicker';
import { _ } from 'underscore-node';
import Meteor from 'react-native-meteor';
import moment from 'momentjs'

import style from '../../styles/styles.js';
import { Subheader } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';



class NewPeriod extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      exercises: [],
      ds: ds.cloneWithRows([]),
      errors: [],
    }
    this.goBack = this.goBack.bind(this);
    this.changeStart = this.changeStart.bind(this);
    this.changeEnding = this.changeEnding.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.saveTempExercise = this.saveTempExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.savePeriod = this.savePeriod.bind(this);
  }

  goBack() {
    this.props.navigator.pop()
  }

  saveTempExercise(text) {
    this.setState({ newExercise: text })
  }

  addExercise() {
    if (this.state.newExercise) {
      let exercises = this.state.exercises;
      exercises.push(this.state.newExercise);
      this.setState({
        exercises,
        ds: ds.cloneWithRows(exercises),
        newExercise: '',
        error: null,
      });
    }
  }

  removeExercise(ex) {
    const { exercises } = this.state;
    const without = _.without(exercises, ex);
    this.setState({
      exercises: without,
      ds: this.state.ds.cloneWithRows(without)
    });
  }

  savePeriod() {
    const { startsAt, endsAt, exercises } = this.state;
    let error = this.state.error;
    if (!startsAt || !endsAt || !exercises.length){
      error = "Make sure you filled all information!";
      return this.setState({ error });
    } else {
      errors = null;
      const userId = Meteor.userId();
      const data = {
        userId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
        exercises
      }
      Meteor.call('periods.insert', data, (err) => {
        if (err) {
          return this.setState({ error: err.reason });
        }

        this.props.navigator.pop();
      });
    }
  }

  renderRow(ex) {
    return (
      <View style={style.newExerciseColl} >
        <Text style={style.newExerciseColl.name}>{ex}</Text>
        <TouchableHighlight onPress={this.removeExercise.bind(null, ex)}>
          <Text style={style.newExerciseColl.remove} >
            <Icon name="delete" size={20} color="red" />
          </Text>
        </TouchableHighlight>
      </View>
    )
  }

  changeStart(date) {
    this.setState({ startsAt: date })
  }

  changeEnding(date) {
    this.setState({ endsAt: date })
  }

  render() {
    const { error } = this.state;
    return (
      <View>
        <Text>New Period</Text>
        <View>
          {error &&
            <Text style={style.error}>
              {error}
            </Text>
          }
        </View>

        <View>
          <Text>Period starts at: </Text>
          <DatePicker style={{width: 200}}
            date={this.state.startsAt}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2016-05-01"
            maxDate="2018-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={style.datePicker}
            onDateChange={this.changeStart}
          />
          <Text>Period ends at: </Text>
          <DatePicker style={{width: 200}}
            date={this.state.endsAt}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2016-05-01"
            maxDate="2018-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={style.datePicker}
            onDateChange={this.changeEnding}
          />
          <Text>
            Enter exercises:
          </Text>
          <TextInput
            ref="newExercise"
            style={style.textInput}
            onChangeText={this.saveTempExercise}
            value={this.state.newExercise}
          />

          <View style={{maxHeight: 100}} >
            <ScrollView>
              <ListView
                dataSource={this.state.ds}
                renderRow={this.renderRow}
              >
              </ListView>
            </ScrollView>
          </View>

          <View style={style.saveBtn} >
            <Icon.Button name="add" {...style.btnStyle} onPress={this.addExercise}>
              add exercise
            </Icon.Button>
          </View>

          <View style={style.margin} >
            <Icon.Button name="save" {...style.btnStyle} onPress={this.savePeriod}>
              Save Period
            </Icon.Button>
          </View>
          <View style={style.margin}>
            <Icon.Button name="keyboard-arrow-left" {...style.btnStyle} onPress={this.goBack}>
              go back
            </Icon.Button>
          </View>
        </View>
      </View>
    );
  }
}

export default NewPeriod;
