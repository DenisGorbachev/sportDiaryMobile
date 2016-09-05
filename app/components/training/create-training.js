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

import DatePicker from 'react-native-datepicker';

import moment from 'momentjs';
import { Cell, Section, TableView } from 'react-native-tableview-simple';
import Meteor from 'react-native-meteor';
import { _ } from 'underscore';
export default class CreateTraining extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      selectExercises: props.exercises,
      exercises: [],
      modalVisible: false,
      error: null,
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
    this.changeDate = this.changeDate.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
  }

  handleSelectExercise(value) {
    const { exercises } = this.state;
    exercises.push({ name: value, editMode: false });
    this.setState({ exercises });
  }

  _getOptionList() {
    return this.refs['OPTIONLIST'];
  }

  changeDate(date) {
    this.setState({ date, exercises });
  }

  save() {
    const training = {
      userId: Meteor.userId(),
      periodId: this.props._id,
      exercises: this.state.exercises,
      date: this.state.date,
    };
    Meteor.call('trainings.insert', training, (err) => {
      if (err) {
        console.error(training)
        this.setState({ error: err.reason });
      } else {
        this.goBack();
      }
    });
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
      error: null,
    });
  }

  saveExercise() {
    const { editingExerciseIndex, exercises } = this.state;
    const { sets, date } = exercises[editingExerciseIndex];
    if (!sets.length) {
      this.setState({ error: 'Make sure you filled all information' });
    } else {
      this.setState({ error: null });
      this.setModalVisible(false);
    }
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
    const {
      exercises,
      editingExerciseIndex,
      newSet,
      date,
      error
    } = this.state;
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
         {error && <Text style={{color: 'red'}} >{error}</Text>}
          <View>
            <Text>Period starts at: </Text>
            <DatePicker style={{width: 200}}
              date={(ex && ex.date) || date}
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
              onDateChange={this.changeDate}
            />
          </View>


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
    const { modalVisible, error } = this.state;
    const { exercises } = this.props;
    const selectedExercises = this.state.exercises.map(ex => (ex.name));
    const items = _.difference(exercises, selectedExercises );
    return (
      <View>
        <Text>Create Training:</Text>
        {error && <Text style={{color: 'red'}} >{error}</Text>}
        {items.length ?
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
          : null
        }
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

