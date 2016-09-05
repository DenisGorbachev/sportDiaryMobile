import React from 'react';
import {
  Image,
  Text, Navigator,
  TouchableHighlight,
  View,
  ListView,
  ScrollView,
  Modal,
  TextInput,
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
    this.setRepeats = this.setRepeats.bind(this);
    this.setWeight = this.setWeight.bind(this);
    this.addSetToEditingExercise = this.addSetToEditingExercise.bind(this);
    this.clearText = this.clearText.bind(this);
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

  setRepeats(value) {
    const { newSet = {} } = this.state;
    newSet.repeats = parseInt(value, 10);
    this.setState({ newSet });
  }

  setWeight(value) {
    const { newSet = {} } = this.state;
    newSet.weight = parseInt(value, 10);
    this.setState({ newSet });
  }

  addSetToEditingExercise() {
    const { editingExerciseIndex, exercises, newSet } = this.state;
    const { weight, repeats } = newSet;
    if (weight && repeats) {
      exercises[editingExerciseIndex].sets.push(newSet);
      this.setState({ exercises, newSet: {}});
      this.clearText()
    }
  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  clearText() {
    this._weightInput.setNativeProps({text: ''});
    this._repeatsInput.setNativeProps({text: ''});
    
  }

  renderEditModal() {
    const { exercises, editingExerciseIndex, newSet } = this.state;
    const ex = exercises[editingExerciseIndex];
    if (!ex.sets) {
      ex.sets = [];
    }
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text>N</Text>
              <Text>Weight</Text>
              <Text>Repeats</Text>
            </View>
              {ex.sets && ex.sets.map( (s,index) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <Text>{index+1}</Text>
                  <Text>{s.weight}</Text>
                  <Text>{s.repeats}</Text>
                </View>
              ))}

            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
              <TextInput
                style={{height: 40, width: 100}}
                placeholder="enter weight"
                onChangeText={this.setWeight}
                ref={component => this._weightInput = component}
              />
              <TextInput
                style={{height: 40, width: 100}}
                placeholder="enter repeats"
                onChangeText={this.setRepeats}
                ref={component => this._repeatsInput = component}
              />
              <TouchableHighlight onPress={this.addSetToEditingExercise} >
                <Text>
                  add
                </Text>
              </TouchableHighlight>
            </View>



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

