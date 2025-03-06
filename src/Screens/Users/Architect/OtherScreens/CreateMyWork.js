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
    // bid: '',
    time: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await AsyncStorage.getItem('userId');
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

  const validateInputs = () => {
    if (!createData.siteName.trim()) {
      Snackbar.show({
        text: 'Please enter SiteName',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!createData.address.trim()) {
      Snackbar.show({
        text: 'Please enter Address',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!createData.budget.trim()) {
      Snackbar.show({
        text: 'Please enter Budget',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    // if (!createData.bid.trim()) {
    //   Snackbar.show({
    //     text: 'Please enter Bid',
    //     backgroundColor: '#D1264A',
    //     duration: Snackbar.LENGTH_SHORT,
    //   });
    //   return false;
    // }

    if (!materialSelected) {
      Snackbar.show({
        text: 'Please select Material item',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!createData.time.trim()) {
      Snackbar.show({
        text: 'Please enter Time',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }

    if (!createData.description.trim()) {
      Snackbar.show({
        text: 'Please enter Description',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (documentFiles.length === 0) {
      Snackbar.show({
        text: 'Please upload at least one image',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    return true; // If all validations pass
  };

  const CreateWorkAPI = () => {
    if (!validateInputs()) return;
    const formData = new FormData();

    formData.append('site_name', createData.siteName);
    formData.append('address', createData.address);
    formData.append('budget', createData.budget);
    // formData.append('bid', createData.bid);
    formData.append('time', createData.time);
    formData.append('material', materialSelected);
    formData.append('description', createData.description);
    formData.append('architecture_id', archiId);

    if (documentFiles && documentFiles.length > 0) {
      documentFiles.forEach((file, index) => {
        const formattedUri = file.uri.startsWith('file://')
          ? file.uri
          : `file://${file.uri}`;
        formData.append(`image[]`, {
          uri: formattedUri,
          type: file.type ? file.type : 'image/jpeg',

          name: file.fileName || `image_${index}.jpg`,
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
            // bid: '',
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
        Snackbar.show({
          text: err.response?.data?.message || err.message,
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };

  const handleUpload = async () => {
    try {
      launchImageLibrary(
        {
          quality: 0.7,
          selectionLimit: 5,
          mediaType: 'photo',
        },
        response => {
          if (!response || !response.assets || response.assets.length === 0) {
            return;
          }

          // Ensure correct URI format
          const newImages = response.assets.map(asset =>
            asset.uri.startsWith('file://') ? asset.uri : `file://${asset.uri}`,
          );

          // Update state without duplicates
          setUploadImgs(prevImages => [
            ...new Set([...prevImages, ...newImages]),
          ]);
          setDocumentFiles(prevFiles => [
            ...new Set([...prevFiles, ...response.assets]),
          ]);

          console.log('Selected Images:', newImages);
        },
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting images.');
    }
  };

  // Function to remove an image
  const handleRemoveImage = index => {
    setUploadImgs(prevImages => prevImages.filter((_, i) => i !== index));
    setDocumentFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
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
              value={createData.siteName}
              onChangeText={text => onChange('siteName', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Address"
              placeholderTextColor="gray"
              keyboardType="default"
              value={createData.address}
              onChangeText={text => onChange('address', text)}
            />

            {/* <View style={styles.experienceView}> */}
            <TextInput
              style={styles.InputField}
              placeholder="Budget"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={createData.budget}
              onChangeText={text => onChange('budget', text)}
            />
            {/* <TextInput
                style={[styles.InputField, {width: WIDTH(44)}]}
                placeholder="Bid"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={createData.bid}
                onChangeText={text => onChange('bid', text)}
              /> */}
            {/* </View> */}

            <TextInput
              style={styles.InputField}
              placeholder="Time"
              placeholderTextColor="gray"
              keyboardType="default"
              value={createData.time}
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
                  {label: 'Labour', value: 'Labour'},
                  {label: 'Labour + Material', value: 'Labour + Material'},
                ]}
                // placeholder={{label: 'Material', value: null}}
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
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{uri: img}} style={styles.image} />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => handleRemoveImage(index)}>
                      <Image
                        source={require('../../../../assets/Icons/cross.png')}
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  </View>
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

  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: -1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    width: 15, // Adjust the size of the cross icon
    height: 15,
    tintColor: 'red', // Change color if needed
  },
});
