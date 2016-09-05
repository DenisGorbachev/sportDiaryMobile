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
      <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 10}} >
        <Text style={{width:100}}>{ex}</Text>
        <TouchableHighlight onPress={this.removeExercise.bind(null, ex)}>
          <Text style={{color: 'red'}} >
            remove
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
    const btnStyle = {
      backgroundColor: "black",
      border: "none",
      color: "white",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
    }
    const { error } = this.state;
    return (
      <View>
        <Text>New Period</Text>
        <View>
          {error &&
            <Text style={{color: 'red'}}>
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
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              },
            }}
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
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              },
            }}
            onDateChange={this.changeEnding}
          />
          <Text>
            Enter exercises:
          </Text>
          <TextInput
            ref="newExercise"
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
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

          <TouchableHighlight onPress={this.addExercise} >
            <Text style={{marginTop:20}} >add exercise</Text>
          </TouchableHighlight>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }} >
            <TouchableHighlight onPress={this.savePeriod} >
              <Text style={{marginTop:20}} >Save Period</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={this.goBack} >
              <Text style={{marginTop:20}} >Go back</Text>
            </TouchableHighlight>
          </View>

        </View>
      </View>
    );
  }
}

export default NewPeriod;
