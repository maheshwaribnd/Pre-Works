import {
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const ContractorMyWork = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [uploadImgs, setUploadImgs] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [materialSelected, setMaterialSelected] = useState('');
  const [createWork, setCreateWork] = useState({
    name: '',
    address: '',
    price: '',
    time: '',
  });

  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      padding: 10,
      color: 'black',
    },
    inputAndroid: {
      fontSize: 16,
      paddingLeft: 10,
      color: 'black',
    },
  };

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
    formData.append('material', materialSelected);

    if (documentFiles?.length > 0) {
      formData.append('image', {
        uri: documentFiles[0].uri,
        type: documentFiles[0].type,
        name: documentFiles[0].fileName,
      });
    }
    console.log('formData', formData);

    ApiManager.ContractorWork(formData)
      .then(res => {
        console.log('res?.PCW', res?.data);

        if (res?.data?.status === 200) {
          console.log('res?.dataPCW', res?.data);

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
        selectionLimit: 5, // Ensure at least one image is selected
        mediaType: 'photo',
        includeBase64: false,
      },
      response => {
        console.log('Response:', response);
        if (response?.didCancel) {
          console.log('User cancelled image selection');
          setUploadImgs([]);
        } else if (response?.assets?.length > 0) {
          const newImages = response.assets;
          console.log('Selected images:', newImages); // Debugging
          setUploadImgs(prevImgs => [...prevImgs, ...newImages]);
        } else {
          console.log('Error selecting image');
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{paddingVertical: HEIGHT(2), paddingHorizontal: WIDTH(4)}}>
            <View style={styles.imageContainer}>
              <Image
                source={
                  uploadImgs.length > 0 && uploadImgs[0]?.uri
                    ? {uri: uploadImgs[0].uri}
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

            <View style={styles.InputField}>
              <RNPickerSelect
                onValueChange={value => setMaterialSelected(value)}
                items={[
                  {label: 'Labour', value: 'Labour'},
                  {label: 'Labour + Material', value: 'Labour + Material'},
                ]}
                placeholder={{label: 'Select Material', value: null}}
                value={materialSelected} // Ensure selected value is shown
                style={{
                  inputIOS: styles.pickerInput,
                  inputAndroid: styles.pickerInput,
                }}
                useNativeAndroidPickerStyle={false}
              />
            </View>

            {/* <View
              style={[
                styles.InputField,
                {alignItems: 'center', justifyContent: 'flex-end'},
              ]}>
              <RNPickerSelect
                onValueChange={value => setMaterialSelected(value)}
                items={[
                  {label: 'Labour', value: 'Labour'},
                  {label: 'Labour + Material', value: 'Labour + Material'},
                ]}
                placeholder={{label: 'Labour', value: 'Labour'}}
                style={styles.picker}
                useNativeAndroidPickerStyle={false}
              />
            </View> */}

            <View style={styles.button}>
              <CustomButton name="SAVE" onPress={() => ContractorWorkAPI()} />
            </View>
          </View>
        </ScrollView>
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

  pickerContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLOR.Gray,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  pickerInput: {
    fontSize: 16,
    color: 'black',
  },

  picker: {
    inputIOS: {
      fontSize: 16,
      padding: 10,
      color: 'gray',
    },
    inputAndroid: {
      fontSize: 16,
      paddingLeft: 3,
      color: 'gray',
    },
  },

  button: {
    // marginTop: HEIGHT(30),
  },
});
