import React from 'react';
import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
  ScrollView,
  Modal,
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
      modalVisible: false,
    };
    this.goBack = this.goBack.bind(this);
    this.save = this.save.bind(this);
    this.handleSelectExercise = this.handleSelectExercise.bind(this);
    this._getOptionList = this._getOptionList.bind(this);
    this.selectExercise = this.selectExercise.bind(this);
    this.removeExercise = this.removeExercise.bind(this);
    this.editExercise = this.editExercise.bind(this);
    this.saveExercise = this.saveExercise.bind(this);
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

  editExercise(index) {
    this.setState({
      modalVisible: true,
      editingExerciseIndex: index,
    });
  }

  saveExercise() {

  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderEditModal() {
    const { exercises, editingExerciseIndex } = this.state;
    const ex = exercises[editingExerciseIndex];
    console.error(ex);
    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <Text>edit:</Text>


            <TouchableHighlight onPress={this.saveExercise}>
              <Text>save...</Text>
            </TouchableHighlight>


            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Back</Text>
            </TouchableHighlight>


          </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>

      </View>
    )
  }

  render() {
    const { modalVisible } = this.state;
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
          {selectedExercises.map( (ex, index) => (
            <View style = {{flexDirection: 'row', justifyContent: 'space-around'}}>
              <TouchableHighlight>
                <Text>{ex}</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.editExercise.bind(this, index)} >
                <Text style={{color: 'green'}} >edit</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.removeExercise.bind(this, ex)} >
                <Text style={{color: 'red'}} >remove</Text>
              </TouchableHighlight>
            </View>
          ))}
        </View>

        {modalVisible && this.renderEditModal()}

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

