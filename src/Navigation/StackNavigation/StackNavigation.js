import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../../Screens/Splash/Splash';
import Login from '../../Screens/Login/Login';
import ForgotPassword from '../../Screens/ForgotPassword/ForgotPassword';
import WelcomeScreen from '../../Screens/Welcome/WelcomeScreen';
import CustomerRegistraion from '../../Screens/SignupRegistraion/CustomerRegistraion';
import ArchitectRegistration from '../../Screens/SignupRegistraion/ArchitectRegistration';
import ContractorRegistration from '../../Screens/SignupRegistraion/ContractorRegistration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContractorTabNav from '../BottomNavigation/ContractorTabNav';
import ArchitectTabNav from '../BottomNavigation/ArchitectTabNav';
import CustomerTabNav from '../BottomNavigation/CustomerTabNav';
import CustomerProfile from '../../Screens/Users/Customer/OtherScreens/CustomerProfile';
import ArchitectList from '../../Screens/Users/Customer/OtherScreens/ArchitectList';
import ContractorProfile from '../../Screens/Users/Contractor/OtherScreens/ContractorProfile';
import OTPScreen from '../../Screens/OTPScreen/OTPScreen';
import OpenPreworkDeatils from '../../Screens/Users/Customer/OtherScreens/OpenPreworkDetails';
import ClosedPreworkDetails from '../../Screens/Users/Customer/OtherScreens/ClosedPreworkDetails';
import ArchitectDetails from '../../Screens/Users/Customer/OtherScreens/ArchitectDetails';
import CreatePreWork from '../../Screens/Users/Customer/OtherScreens/CreatePreWork';
import ArchitectPastPreworkDetails from '../../Screens/Users/Customer/OtherScreens/ArchitectPastPreworkDetails';
import CreateMyWork from '../../Screens/Users/Architect/OtherScreens/CreateMyWork';
import MyWorkDetails from '../../Screens/Users/Architect/OtherScreens/MyWorkDetails';
import Profile from '../../Screens/Users/Architect/ArchitectMainScreens/Profile';
import NewPreworkDetails from '../../Screens/Users/Contractor/OtherScreens/NewPreworkDetails';

const Stack = createNativeStackNavigator();

const StackNavigation = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const getUserRole = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role) {
        setUserRole(role);
      }
    };
    getUserRole();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',
          animationDuration: 400,
        }}>
        <Stack.Screen name="splash" component={SplashScreen} />
        <Stack.Screen name="welcome" component={WelcomeScreen} />
        <Stack.Screen name="otpscreen" component={OTPScreen} />
        <Stack.Screen name="login" component={Login} />
        <Stack.Screen name="customersignup" component={CustomerRegistraion} />
        <Stack.Screen
          name="contractorsignup"
          component={ContractorRegistration}
        />
        <Stack.Screen
          name="architectsignup"
          component={ArchitectRegistration}
        />
        <Stack.Screen name="forgotpassword" component={ForgotPassword} />

        {/* Bottom Tabs */}
        <Stack.Screen name="customerTabs" component={CustomerTabNav} />
        <Stack.Screen name="contractorTabs" component={ContractorTabNav} />
        <Stack.Screen name="architectTabs" component={ArchitectTabNav} />

        {/* Customer */}
        <Stack.Screen
          name="customerprofilescreen"
          component={CustomerProfile}
        />
        <Stack.Screen name="architectlist" component={ArchitectList} />
        <Stack.Screen
          name="architectDetailscreen"
          component={ArchitectDetails}
        />

        <Stack.Screen name="createprework" component={CreatePreWork} />
        <Stack.Screen
          name="openpreworkdeatils"
          component={OpenPreworkDeatils}
        />
        <Stack.Screen
          name="closedpreworkdetails"
          component={ClosedPreworkDetails}
        />
        <Stack.Screen
          name="architectpastpreworkdetails"
          component={ArchitectPastPreworkDetails}
        />

        {/* Contractor */}
        <Stack.Screen name="contractorprofile" component={ContractorProfile} />
        <Stack.Screen name="newpreworkdetails" component={NewPreworkDetails} />

        {/* Architect */}

        <Stack.Screen name="createmywork" component={CreateMyWork} />
        <Stack.Screen name="myworkdetails" component={MyWorkDetails} />
        <Stack.Screen name="architectprofile" component={Profile} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
