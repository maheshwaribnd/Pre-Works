import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../../../config/color.json';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import ApiManager from '../../../../API/Api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const ContractorMyWork = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [uploadImgs, setUploadImgs] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [createWork, setCreateWork] = useState({
    name: '',
    address: '',
    price: '',
    time: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  const onChange = (key, value) => {
    setCreateWork(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const ContractorWorkAPI = () => {
    const formData = new FormData();

    formData.append('name', createWork?.name);
    formData.append('address', createWork?.address);
    formData.append('price', createWork?.price);
    formData.append('time', createWork?.time);
    formData.append('contractor_id', userId);

    if (documentFiles?.length > 0) {
      formData.append('images', {
        uri: documentFiles[0].uri,
        type: documentFiles[0].type,
        name: documentFiles[0].fileName,
      });
    }

    ApiManager.ContractorWork(formData)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.navigate('contractorprofile');
        }
      })
      .catch(err => {
        console.log('API Error:', err.response?.data || err.message);
      });
  };

  const handleUpload = async () => {
    launchImageLibrary(
      {
        quality: 0.7,
        selectionLimit: 0, // Allows multiple images
        mediaType: 'photo', // Ensures only images are selected
      },
      fileobj => {
        if (fileobj?.didCancel) {
          setUploadImgs([]);
        } else {
          const newImages = fileobj?.assets || [];
          setUploadImgs(prevImgs => [...prevImgs, ...newImages]); // Append new images
        }
      },
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="My Work" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <View style={{paddingVertical: HEIGHT(2), paddingHorizontal: WIDTH(4)}}>
          <View style={styles.imageContainer}>
            <Image
              source={
                uploadImgs.length > 0
                  ? {uri: uploadImgs[0].uri} // Corrected reference
                  : require('../../../../assets/Imgs/HouseImg.jpg')
              }
              style={styles.image}
            />

            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={() => handleUpload()}>
              <Text style={styles.addPhotoText}>Add Photo+</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.InputField}
            keyboardType="default"
            placeholder="Site Name"
            value={createWork?.name}
            onChangeText={text => onChange('name', text)}
          />

          <TextInput
            style={styles.InputField}
            placeholder="Address"
            keyboardType="default"
            value={createWork?.address}
            onChangeText={text => onChange('address', text)}
          />

          <TextInput
            style={styles.InputField}
            placeholder="Price"
            keyboardType="number-pad"
            value={createWork?.price}
            onChangeText={text => onChange('price', text)}
          />

          <TextInput
            style={styles.InputField}
            placeholder="Time"
            keyboardType="default"
            value={createWork.time}
            onChangeText={text => onChange('time', text)}
          />

          <View style={styles.button}>
            <CustomButton name="SAVE" onPress={() => ContractorWorkAPI()} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ContractorMyWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },

  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: HEIGHT(2),
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    borderWidth: 0.5,
  },

  addPhotoButton: {
    position: 'absolute',
    // top: 10,
    right: 0,
    backgroundColor: '#0485E4', // Replace with your theme color
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },

  addPhotoText: {
    color: COLOR.White,
    fontSize: 14,
    fontWeight: 'bold',
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

  button: {
    // marginTop: HEIGHT(30),
  },
});
