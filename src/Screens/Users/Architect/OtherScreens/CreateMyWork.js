import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ApiManager from '../../../../API/Api';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import COLOR from '../../../../config/color.json';
import {HEIGHT, NotoSans_Light, WIDTH} from '../../../../config/AppConst';
import RNPickerSelect from 'react-native-picker-select';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import {useNavigation} from '@react-navigation/native';

const CreateMyWork = () => {
  const navigation = useNavigation();
  const [archiId, setArchiId] = useState(null);

  const [materialSelected, setMaterialSelected] = useState('');
  const [uploadImgs, setUploadImgs] = useState([]); // Store multiple images
  const [documentFiles, setDocumentFiles] = useState([]);
  const [createData, setCreateData] = useState({
    siteName: '',
    address: '',
    budget: '',
    bid: '',
    time: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await AsyncStorage.getItem('ArchitectId');
        console.log('archituserID', userID);
        setArchiId(userID);
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const onChange = (key, value) => {
    setCreateData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const CreateWorkAPI = () => {
    const formData = new FormData();

    formData.append('site_name', createData.siteName);
    formData.append('address', createData.address);
    formData.append('budget', createData.budget);
    formData.append('bid', createData.bid);
    formData.append('time', createData.time);
    formData.append('material', materialSelected);
    formData.append('description', createData.description);
    formData.append('architecture_id', archiId);

    if (documentFiles && documentFiles.length > 0) {
      documentFiles.forEach((file, index) => {
        formData.append(`image[${index}]`, {
          uri: file.uri,
          type: file.type,
          name: file.fileName,
        });
      });
    }
    ApiManager.architectMyworkCreate(formData)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });

          // Reset states
          setCreateData({
            siteName: '',
            address: '',
            budget: '',
            bid: '',
            time: '',
            description: '',
          });
          setMaterialSelected([]);
          setDocumentFiles([]);
          setUploadImgs([]); // Clear preview images
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.navigate('architectTabs');
        } else {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(err => {
        console.log('API Error:', err.response?.data || err.message);
      });
  };

  const handleUpload = async () => {
    try {
      launchImageLibrary(
        {
          quality: 0.7,
          selectionLimit: 5, // Allow selecting multiple images
          mediaType: 'photo',
        },
        fileobj => {
          if (fileobj?.didCancel) {
            return;
          }
          const newImages = fileobj?.assets?.map(asset => asset.uri) || [];
          setUploadImgs(prevImages => [...prevImages, ...newImages]); // Append new images
          setDocumentFiles(prevFiles => [
            ...prevFiles,
            ...(fileobj?.assets || []),
          ]);
        },
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting images.');
    }
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Add My Work" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{paddingVertical: HEIGHT(3), alignItems: 'center'}}>
            <TextInput
              style={styles.InputField}
              placeholder="Site Name"
              placeholderTextColor="gray"
              keyboardType="default"
              value={createData.name}
              onChangeText={text => onChange('siteName', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Address"
              placeholderTextColor="gray"
              keyboardType="default"
              value={createData.siteAddress}
              onChangeText={text => onChange('address', text)}
            />

            <View style={styles.experienceView}>
              <TextInput
                style={[styles.InputField, {width: WIDTH(44)}]}
                placeholder="Budget"
                placeholderTextColor="gray"
                keyboardType="default"
                value={createData.city}
                onChangeText={text => onChange('budget', text)}
              />
              <TextInput
                style={[styles.InputField, {width: WIDTH(44)}]}
                placeholder="Bid"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={createData.pincode}
                onChangeText={text => onChange('bid', text)}
              />
            </View>

            <TextInput
              style={styles.InputField}
              placeholder="Time"
              placeholderTextColor="gray"
              keyboardType="default"
              value={createData.siteArea}
              onChangeText={text => onChange('time', text)}
            />

            {/* For Material Select */}
            <View
              style={[
                styles.InputField,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <RNPickerSelect
                onValueChange={value => setMaterialSelected(value)}
                items={[
                  {label: 'With Material', value: 'With Material'},
                  {label: 'Without Material', value: 'Without Material'},
                ]}
                placeholder={{label: 'Material', value: null}}
                style={styles.picker}
              />
            </View>

            <View style={styles.btnWrap}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                activeOpacity={0.9}>
                <View style={styles.uploadView}>
                  <Text style={styles.icon}>☁️</Text>
                  <Text style={styles.uploadTxt}>
                    Upload Preview Work Images
                  </Text>
                </View>
              </TouchableOpacity>

              <ScrollView horizontal style={{marginTop: 10}}>
                {uploadImgs.map((img, index) => (
                  <Image
                    key={index}
                    source={{uri: img}}
                    style={{width: 60, height: 60, marginRight: 10}}
                  />
                ))}
              </ScrollView>
            </View>

            <TextInput
              value={createData.description}
              placeholder="Description"
              onChangeText={text => onChange('description', text)}
              placeholderTextColor="gray"
              keyboardType="default"
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              style={[
                styles.InputField,
                {height: HEIGHT(25), textAlign: 'auto'},
              ]}
            />

            <CustomButton name="Save" onPress={() => CreateWorkAPI()} />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default CreateMyWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  InputField: {
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

  PassInputField: {
    color: COLOR.Black,
    width: WIDTH(80),
    height: HEIGHT(6.5),
  },

  passwordView: {
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

  experienceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  btnWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  uploadView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.Gray,
    color: COLOR.black,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  uploadButton: {
    alignItems: 'center',
    marginVertical: HEIGHT(1),
    backgroundColor: '#fff',
  },

  uploadTxt: {
    fontFamily: NotoSans_Light,
    fontSize: 11,
    color: COLOR.Gray9,
    width: WIDTH(25),
    textAlign: 'center',
  },

  picker: {
    inputIOS: {
      fontSize: 16,
      padding: 10,
      color: 'gray',
    },
    inputAndroid: {
      fontSize: 16,
      padding: 10,
      paddingLeft: 3,
      color: 'gray',
    },
  },
});
