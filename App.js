import {LogBox} from 'react-native';
import React, { useEffect, useState } from 'react';
import StackNavigation from './src/Navigation/StackNavigation/StackNavigation';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import myStore from './src/Redux/Store/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from './src/API/Api';

const App = () => {
  LogBox.ignoreAllLogs();

  // const [userExists, setUserExists] = useState(false)

  // useEffect(() => {
  //   const checkUserStatus = async () => {
  //     const userId = await AsyncStorage.getItem("userId"); // Get stored user ID
  //     if (!userId) {
  //       setUserExists(false);
  //       return;
  //     }

  //     // Fetch user from database
  //     try {
  //       const response = await ApiManager.customerProfile(userId)
  //       if (response.status === 404) {
  //         await AsyncStorage.removeItem("userId"); // Remove user from storage
  //         setUserExists(false);
  //       } else {
  //         setUserExists(true);
  //       }
  //     } catch (error) {
  //       console.log("Error fetching user data:", error);
  //       setUserExists(false);
  //     }
  //   };

  //   checkUserStatus();
  // }, []);

  // if (userExists === null) return null; // Show a loading screen if needed


  return (
    <Provider store={myStore}>
      <StackNavigation />
    </Provider>
  );
};

export default App;
