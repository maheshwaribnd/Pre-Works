import {LogBox} from 'react-native';
import React from 'react';
import StackNavigation from './src/Navigation/StackNavigation/StackNavigation';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import myStore from './src/Redux/Store/Store';

const App = () => {
  // LogBox.ignoreAllLogs();

  return (
    <Provider store={myStore}>
      <StackNavigation />
    </Provider>
  );
};

export default App;
