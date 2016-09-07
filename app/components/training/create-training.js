import React from 'react';
import {
  Image,
  Text,
  Navigator,
  TouchableHighlight,
  View,
  ListView,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

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



import style from '../../styles/styles.js';
import { Subheader } from 'react-native-material-design';
import Icon from 'react-native-vector-icons/MaterialIcons';


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
            <Text>Date: </Text>
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
              <View style={style.headerTableCell}>
                <Text style={style.headerTableCell.row} >N</Text>
                <Text style={style.headerTableCell.row} >Weight</Text>
                <Text style={style.headerTableCell.row} >Repeats</Text>
              </View>
              <View style={{maxHeight: 150}} >
                <ScrollView>
                  {ex.sets && ex.sets.map( (s,index) => (
                    <View style={style.tableCell}>
                      <Text style={style.tableCell.row} >{index+1}</Text>
                      <Text style={style.tableCell.row} >{s.weight}</Text>
                      <Text style={style.tableCell.row} >{s.repeats}</Text>
                    </View>
                  ))}

                </ScrollView>
              </View>
              <View style={style.exForm} >
                <TextInput
                  style={style.exInput}
                  placeholder="enter weight"
                  onChangeText={this.setWeight}
                  ref={component => this._weightInput = component}
                />
                <TextInput
                  style={style.exInput}
                  placeholder="enter repeats"
                  onChangeText={this.setRepeats}
                  ref={component => this._repeatsInput = component}
                />
                <View style={style.saveBtn} >
                  <Icon.Button name="add" {...style.btnStyle} onPress={this.addSetToEditingExercise}>
                    add
                  </Icon.Button>
                </View>
              </View>
              <View style={style.margin} >
                <Icon.Button name="save" {...style.btnStyle} onPress={this.saveExercise}>
                  Save...
                </Icon.Button>
              </View>
              <Icon.Button name="keyboard-arrow-left" {...style.btnStyle} onPress={() => {
                this.setModalVisible(!this.state.modalVisible)
              }}>
                go back
              </Icon.Button>



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
          <Text>Edit exercise:</Text>
          {error && <Text style={{color: 'red'}} >{error}</Text>}
          {items.length ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Select
                  width={250}
                  ref="SELECT1"
                  optionListRef={this._getOptionList}
                  defaultValue="Select Exersice ..."
                  onSelect={this.selectExercise.bind(this)}>
                  {items.map(item => (
                    <Option>{item}</Option>
                  ))}
                </Select>

                <OptionList ref="OPTIONLIST"/>
            </View>
            : null
          }
          <View style={{maxHeight: 250}}>
            <ScrollView>
              <Text>Selected Exersices:</Text>
              {selectedExercises.map( (ex, index) => (
                <View style={style.newExerciseColl} >
                  <Text style={style.newExerciseColl.name}>{ex}</Text>
                  <TouchableHighlight onPress={this.editExercise.bind(this, index)}>
                    <Text style={style.newExerciseColl.remove} >
                      <Icon name="border-color" size={20} color="green" />
                    </Text>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={this.removeExercise.bind(null, ex)}>
                    <Text style={this.removeExercise.bind(this, ex)} >
                      <Icon name="delete" size={20} color="red" />
                    </Text>
                  </TouchableHighlight>
                </View>
              ))}
            </ScrollView>
          </View>

          {modalVisible && this.renderEditModal()}

          <View style={style.margin} >
            <Icon.Button name="save" {...style.btnStyle} onPress={this.save}>
              Save
            </Icon.Button>
          </View>
          <Icon.Button name="keyboard-arrow-left" {...style.btnStyle} onPress={this.goBack}>
              go back
          </Icon.Button>
      </View>
    );
  }
}

