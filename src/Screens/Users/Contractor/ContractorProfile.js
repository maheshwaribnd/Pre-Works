import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Light,
  NotoSans_Medium,
  WIDTH,
} from '../../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ApiManager from '../../API/Api';
import EditIcon from '../../../assets/Svg/edit.svg';
import {Badge} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import ApiManager from '../../../API/Api';
import CustomButton from '../../../Component/CustomButton/CustomButton';
import CustomHeader from '../../../Component/CustomeHeader/CustomHeader';

const ConstractorProfile = () => {
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [userImage, setuserImage] = useState('');

  const fetchContractorProfile = async () => {
    try {
      const userID = await AsyncStorage.getItem('contractoruserId');
      setUserId(userID);
      console.log('UserIDCC:', userID);

      if (userID) {
        const response = await ApiManager.ContractorProfile(userID);
        if (response?.data?.status === 200) {
          console.log('333', response?.data?.['contractors ']);

          const contractorData = response?.data?.['contractors '];
          setData(contractorData);
        }
      }
    } catch (error) {
      console.error('Error in fetching data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchContractorProfile();
  }, []);

  const selectImage = async () => {
    launchImageLibrary({quality: 0.7}, fileobj => {
      if (fileobj?.didCancel === true) {
        setuserImage('');
        // setUserData(prev => ({...prev, img: ''})); // Update userData
      } else {
        const img = fileobj?.assets[0]?.uri || '';
        setuserImage(img);
        // setUserData(prev => ({...prev, img})); // Update userData
        setDocumentFile(fileobj?.assets);
      }
    });
  };

  const onChange = (key, value) => {
    setData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Profile" />
      <ImageBackground
        source={require('../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setEdit(!edit);
          }}
          style={styles.edit}>
          <EditIcon color="grey" />
        </TouchableOpacity>
        <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
          <View
            style={{
              paddingTop: HEIGHT(3),
              paddingBottom: HEIGHT(1),
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: WIDTH(30),
                height: WIDTH(30),
                borderRadius: 50,
                borderWidth: 1,
              }}
              source={{uri: data?.profile_image}} // Use selected image or default profile image
              resizeMode="cover"
            />
            {edit ? (
              <Badge
                onPress={() => selectImage()}
                size={32}
                style={styles.badge}>
                <Octicons size={18} name="pencil" />
              </Badge>
            ) : null}
          </View>
        </View>

        <TextInput
          style={styles.InputField}
          placeholder={data?.name}
          editable={edit}
          value={data?.name}
          onChangeText={text => onChange('name', text)}
        />

        <TextInput
          style={styles.InputField}
          keyboardType="number-pad"
          placeholder={data?.mobile_no}
          editable={edit}
          value={data?.mobile_no}
          onChangeText={text => onChange('mobile_no', text)}
        />

        <TextInput
          style={styles.InputField}
          placeholder={data?.email}
          editable={edit}
          value={data?.email}
          onChangeText={text => onChange('email', text)}
        />

        <TextInput
          style={styles.InputField}
          placeholder={data?.address || 'Address'}
          editable={edit}
          value={data?.address}
          onChangeText={text => onChange('address', text)}
        />

        <View style={{marginBottom: HEIGHT(2)}}>
          {edit ? (
            <CustomButton name="SAVE" onPress={() => console.log('update')} />
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
};

export default ConstractorProfile;

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

  name: {},

  edit: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
});
