import React from 'react';
import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
  ScrollView,
} from 'react-native';

import DropDown, {
  Select,
  Option,
  OptionList,
} from 'react-native-selectme';


import moment from 'momentjs';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import { Meteor } from 'react-native-meteor';
import { _ } from 'underscore';
export default class CreateTraining extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      selectExercises: props.exercises,
      exercises: [],
    };
    this.goBack = this.goBack.bind(this);
    this.save = this.save.bind(this);
    this.handleSelectExercise = this.handleSelectExercise.bind(this);
    this._getOptionList = this._getOptionList.bind(this);
    this.selectExercise = this.selectExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
  }

  handleSelectExercise(value) {
    const { exercises } = this.state;
    exercises.push({ name: value, editMode: false });
    this.setState({ exercises });
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }

  save() {
    const training = {
      userId: Meteor.userId(),
      periodId: this.props.period._id,
      exercises: this.state.exercises,
      date: this.state.date,
    };
  }

  goBack() {
    this.props.navigator.pop();
  }

  selectExercise(ex) {
    const { exercises } = this.state;
    exercises.push({ name: ex, editMode: false });
    this.setState({ exercises });
  }


  removeExercise(ex) {
    const { exercises } = this.state;
    const removeExerciseIndex = _.findIndex(exercises, (e) => (e.name == ex));
    exercises.splice(removeExerciseIndex, 1);
    this.setState({ exercises });
  }

  render() {
    const { exercises } = this.props;
    const selectedExercises = this.state.exercises.map(ex => (ex.name));
    const items = _.difference(exercises, selectedExercises );
    return (
      <View>
        <Text>Create Training:</Text>
        <Text>{this.props._id}</Text>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Select
            width={250}
            ref="SELECT1"
            optionListRef={this._getOptionList}
            defaultValue="Select Exersice ..."
            onSelect={this.selectExercise.bind(this)}>
            <Option value = {{id : "alberta"}}>Exercises</Option>
            {items.map(item => (
              <Option>{item}</Option>
            ))}
          </Select>


          <OptionList ref="OPTIONLIST"/>
        </View>
        <View>
          <Text>Selected Exersices:</Text>
          {selectedExercises.map(ex => (
            <View style = {{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableHighlight>
                <Text>{ex}</Text>
              </TouchableHighlight>
              <TouchableHighlight >
                <Text style={{color: 'green'}} >edit</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.removeExercise.bind(this, ex)} >
                <Text style={{color: 'red'}} >remove</Text>
              </TouchableHighlight>
            </View>
          ))}
        </View>



        <TouchableHighlight onPress={ this.save }>
          <Text>Save</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ this.goBack }>
          <Text>Go back</Text>
        </TouchableHighlight>
      </View>


    );
  }
}

