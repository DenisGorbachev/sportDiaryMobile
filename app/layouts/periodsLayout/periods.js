import React from 'react';
import { Image, Text, Navigator } from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import PeriodsList from './periods-list.js';
import NewPeriod from './new-period.js';

class Periods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Periods',
    };
  }

  renderScene(route, navigator) {
    return <route.component navigator={navigator} {...route.passProps} />
  }

  render() {
    return (
      <Navigator
        renderScene={ this.renderScene }
        initialRoute={{ component: PeriodsList }}
      />
    );
  }
}

export default Periods;
