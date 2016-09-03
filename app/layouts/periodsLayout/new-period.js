import React from 'react';
import {
  Image,
  Text,
  Navigator,
  TouchableHighlight,
  View,
  TextInput,
  ListView
} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import DatePicker from 'react-native-datepicker';

class NewPeriod extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      exercises: [],
      ds: ds.cloneWithRows(["21312","dsaads"]),
    }
    this.goBack = this.goBack.bind(this);
    this.changeStart = this.changeStart.bind(this);
    this.changeEnding = this.changeEnding.bind(this);
    this.addExercise = this.addExercise.bind(this);
    this.saveTempExercise = this.saveTempExercise.bind(this);
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
      });
    }
  }

  renderRow(ex) {
    return (
      <Text>{ex}</Text>
    )
  }

  changeStart(date) {
    this.setState({ startsAt: date })
  }

  changeEnding(date) {
    this.setState({ endsAt: date })
  }

  render() {
    return (
      <View>
        <Text>New Period</Text>

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

          <TouchableHighlight onPress={this.addExercise} >
            <Text>add exercise</Text>
          </TouchableHighlight>

          <ListView
            dataSource={this.state.ds}
            renderRow={this.renderRow}
          >
          </ListView>
        </View>


        <TouchableHighlight onPress={this.goBack} >
          <Text>Go back</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default NewPeriod;
