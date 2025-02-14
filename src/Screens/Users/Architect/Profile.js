import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import COLOR from '../../../config/color.json';
import {HEIGHT, WIDTH} from '../../../config/AppConst';
import CustomHeader from '../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../API/Api';

const Profile = () => {
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [userImage, setuserImage] = useState('');

  const fetchCustomerProfile = async () => {
    try {
      const userID = await AsyncStorage.getItem('ArchitectId');
      setUserId(userID);
      console.log('UserIDAR:', userID);

      if (userID) {
        const response = await ApiManager.ArchitectProfile(userID);
        if (response?.data?.status === 200) {
          const customerData = response?.data;
          setData(customerData);
        }
      }
    } catch (error) {
      console.error('Error in fetching data:', error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Profile" />
      <ImageBackground
        source={require('../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
            <Text>Profile</Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },
});
