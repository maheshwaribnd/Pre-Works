import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import NewPrework from '../../Screens/Users/Contractor/ContractorMainScreen/NewPrework';
import ProjectApplied from '../../Screens/Users/Contractor/ContractorMainScreen/ProjectApplied';
import ContractorSetting from '../../Screens/Users/Contractor/ContractorMainScreen/ContractorSetting';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../config/color.json';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Light,
  WIDTH,
} from '../../config/AppConst';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const TabArr = [
  {
    name: 'New Pre-work',
    component: NewPrework,
    Icon1: require('../../assets/NavIcons/IdeaRejected.png'),
    Icon2: require('../../assets/NavIcons/IdeaRejectedUnselect.png'),
  },

  {
    name: 'Project Applied',
    component: ProjectApplied,
    Icon1: require('../../assets/NavIcons/IdeaRejected.png'),
    Icon2: require('../../assets/NavIcons/IdeaRejectedUnselect.png'),
  },

  {
    name: 'Settings',
    component: ContractorSetting,
    Icon1: require('../../assets/NavIcons/settings.png'),
    Icon2: require('../../assets/NavIcons/settingsUnselect.png'),
  },
];

const ContractorTabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        const screen = TabArr.find(item => item.name === route.name);
        return {
          tabBarIcon: ({focused}) => (
            <Image
              source={focused ? screen.Icon1 : screen.Icon2}
              style={{width: 24, height: 24}}
              resizeMode="contain"
            />
          ),
          tabBarActiveTintColor: COLOR.BottomTabTxt,
          tabBarInactiveTintColor: COLOR.BottomTabTxt,
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 5,
            lineHeight: 13.02,
            fontFamily: NotoSans_Light,
            textAlign: 'center',
          },
          tabBarStyle: {height: 75, paddingBottom: 5, paddingTop: 10},
        };
      }}>
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index.toString()}
            name={item.name}
            component={item.component}
            options={{
              // tabBarIcon: item.Icon,
              headerShown: false,
              tabBarActiveTintColor: COLOR.BottomTabTxt,
              tabBarInactiveTintColor: COLOR.BottomTabTxt,
              //   #FBD8B4
              tabBarLabelStyle: {
                fontSize: 14,
                fontWeight: '500',
                marginBottom: 5,
                lineHeight: 13.02,
                fontFamily: NotoSans_Light,
                textAlign: 'center',
              },
              tabBarStyle: {height: 75, paddingBottom: 5, paddingTop: 10},
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default ContractorTabNav;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabBar: {
    height: HEIGHT(9),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4D4D4',
  },

  btn: {
    width: WIDTH(22),
    height: HEIGHT(7),
    borderRadius: 35,
    marginBottom: HEIGHT(1),
    borderColor: COLOR.TabNavigateButton,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },

  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.TabNavigateButton,
    borderRadius: 25,
  },
  text: {
    fontSize: FONTSIZE(1.3),
    fontFamily: NotoSans_Bold,
    textAlign: 'center',
    color: COLOR.Black,
  },
  textColorChange: {
    fontSize: FONTSIZE(1.3),
    fontFamily: NotoSans_Bold,
    textAlign: 'center',
    color: COLOR.White,
  },
});
