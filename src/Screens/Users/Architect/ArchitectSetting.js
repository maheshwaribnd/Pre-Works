import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../../config/color.json';
import CustomHeader from '../../../Component/CustomeHeader/CustomHeader';
import {HEIGHT, WIDTH} from '../../../config/AppConst';
import LogoutComp from '../../../Component/LogoutComp/LogoutComp';

const ArchitectSetting = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setDeleteShowModal] = useState(false);

  const LogoutFunction = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared');
      navigation.navigate('welcome');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const DeletFunction = () => {
    console.log('delete Account');
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Setting" />
      <ImageBackground
        source={require('../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
            <Text>Setting</Text>
            <TouchableOpacity
              style={styles.InputField}
              onPress={() => {
                setShowModal(true), console.log('log');
              }}>
              <View style={{flexDirection: 'row', gap: 6}}>
                <Image
                  source={require('../../../assets/settingsIcon/logout.png')}
                  height={5}
                  width={5}
                  resizeMode="contain"
                />
                <Text style={styles.name}>Log Out</Text>
              </View>
            </TouchableOpacity>

            {showModal ? (
              <LogoutComp
                showModal={showModal}
                setShowModal={setShowModal}
                text="Logout"
                onpress={() => LogoutFunction()}
              />
            ) : null}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ArchitectSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  InputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WIDTH(91.5),
    height: HEIGHT(7.5),
    marginVertical: HEIGHT(1.5),
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: COLOR.Gray,
    color: COLOR.black,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
