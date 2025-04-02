import {
  Alert,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  HEIGHT,
  NotoSans_Light,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import COLOR from '../../../../config/color.json';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ApiManager from '../../../../API/Api';
import RNFS from 'react-native-fs';
import {ActivityIndicator} from 'react-native-paper';

const CreatePreWork = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [selectedStartDate, setStartSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [minBidDate, setMinBidDate] = useState(new Date());

  const [materialSelected, setMaterialSelected] = useState(
    'Labour Rate + Material',
  );
  const [projectSelected, setProjectSelected] = useState('');
  const [uploadImgs, setUploadImgs] = useState([]); // Store multiple images
  const [documentFiles, setDocumentFiles] = useState([]);
  const [PdfFiles, setPdfFiles] = useState([]);
  const [documentpdf, setDocumentPdf] = useState([]);

  const [createData, setCreateData] = useState({
    name: '',
    siteAddress: '',
    city: '',
    pincode: '',
    plotArea: '',
    material: '',
    budgetRange: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await AsyncStorage.getItem('userId');
        setId(userID);
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

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartConfirm = date => {
    setStartSelectedDate(formatDate(date)); // Format date as needed
    setMinBidDate(date);
    hideStartDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setSelectedDate(formatDate(date)); // Format date as needed
    hideDatePicker();
  };

  const formatDate = date => {
    return date.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
  };

  const Validate = () => {
    if (!createData.name.trim()) {
      Snackbar.show({
        text: 'Please enter Name',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!createData.siteAddress.trim()) {
      Snackbar.show({
        text: 'Please enter Site Address',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!createData.city.trim()) {
      Snackbar.show({
        text: 'Please enter City',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    // if (!/^\d{6}$/.test(createData.pincode.trim())) {
    //   Snackbar.show({
    //     text: 'Please enter a valid 6-digit Pincode',
    //     backgroundColor: '#D1264A',
    //     duration: Snackbar.LENGTH_SHORT,
    //   });
    //   return false;
    // }

    if (!createData.plotArea.trim()) {
      Snackbar.show({
        text: 'Please enter Plot Size',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }

    if (!materialSelected) {
      Snackbar.show({
        text: 'Please select Material item',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!selectedStartDate) {
      Snackbar.show({
        text: 'Please select expected Start Date for work.',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }
    if (!selectedDate) {
      Snackbar.show({
        text: 'Please select Last Date for Bidding',
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

    if (documentpdf.length === 0) {
      Snackbar.show({
        text: 'Please upload at least one PDF file.',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }

    // if (!documentFiles.length && !documentpdf.length) {
    //   Alert.alert('No files selected');
    //   return;
    // }

    return true; // If all validations pass
  };

  const CreatePewWorkAPI = async () => {
    // if (loading) return;
    setLoading(true);
    if (!Validate()) return;
    const formData = new FormData();

    formData.append('name', createData.name);
    formData.append('address', createData.siteAddress);
    formData.append('expected_date', selectedStartDate);
    formData.append('last_date', selectedDate);
    formData.append('city', createData.city);
    formData.append('pincode', createData.pincode);
    formData.append('site_area', createData.plotArea);
    formData.append('material', materialSelected);
    // formData.append('projects', projectSelected);
    formData.append('customer_id', id);
    formData.append('description', createData.description);
    // Upload images
    if (documentFiles && documentFiles.length > 0) {
      documentFiles.forEach((file, index) => {
        const formattedUri = file.uri.startsWith('file://')
          ? file.uri
          : `file://${file.uri}`;

        formData.append(`upload_image[]`, {
          uri: formattedUri,
          type: file.type || 'image/jpeg',
          name: file.fileName || `image_${index}.jpg`,
        });
      });
    }

    documentpdf.forEach((pdf, index) => {
      formData.append(`files[]`, {
        uri: pdf.uri,
        name: pdf.name,
        type: pdf.type,
      });
    });

    console.log('formdata', formData);

    await ApiManager.createPreWork(formData)
      .then(res => {
        if (res?.data?.status === 200) {
          console.log('API Response create preworkk:', res?.data);
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          setLoading(false);

          // Reset states
          setCreateData({
            name: '',
            siteAddress: '',
            city: '',
            pincode: '',
            siteArea: '',
            budgetRange: '',
            customBid: '',
            description: '',
          });
          setStartSelectedDate(null);
          setSelectedDate(null);
          setMaterialSelected([]);
          setProjectSelected([]);
          setDocumentFiles([]);
          setDocumentPdf([]);
          setUploadImgs([]); // Clear preview images

          navigation.navigate('customerTabs');
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

  useEffect(() => {
    requestStoragePermission();
  }, []);

  //download pdf function
  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        return (
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
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

  const handleUploadPDF = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Allows only PDF selection
        allowMultiSelection: true, // Allows multiple PDFs
      });

      // const newDocs = response.map(doc => ({
      //   uri: doc.uri,
      //   name: doc.name,
      // }));

      const newDocs = await Promise.all(
        response.map(async doc => {
          const newPath = `${RNFS.CachesDirectoryPath}/${doc.name}`;
          await RNFS.copyFile(doc.uri, newPath);

          return {uri: `file://${newPath}`, name: doc.name};
        }),
      );

      setPdfFiles(prevFiles => [...new Set([...prevFiles, ...newDocs])]);
      setDocumentPdf(prevFiles => [...new Set([...prevFiles, ...response])]);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled document picker');
      } else {
        Alert.alert('Error', 'Something went wrong while selecting documents.');
      }
    }
  };

  // Function to remove a selected document
  const handleRemovePDF = index => {
    setPdfFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    // setDocumentPdf(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Create Pre-works" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{paddingVertical: HEIGHT(2)}}>
            <Text style={styles.label}>Enter Prework Name</Text>
            <TextInput
              style={styles.InputField}
              placeholder="Name"
              placeholderTextColor="gray"
              keyboardType="default"
              value={createData.name}
              onChangeText={text => onChange('name', text)}
            />
            <Text style={styles.label}>Enter Plot Address</Text>
            <TextInput
              style={styles.InputField}
              placeholder="Plot Address"
              placeholderTextColor="gray"
              keyboardType="default"
              value={createData.siteAddress}
              onChangeText={text => onChange('siteAddress', text)}
            />
            <View style={styles.experienceView}>
              <View>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={[styles.InputField, {width: WIDTH(44)}]}
                  placeholder="City"
                  placeholderTextColor="gray"
                  keyboardType="default"
                  value={createData.city}
                  onChangeText={text => onChange('city', text)}
                />
              </View>
              <View>
                <Text style={styles.label}>Pincode</Text>
                <TextInput
                  style={[styles.InputField, {width: WIDTH(44)}]}
                  placeholder="Pincode (Optional)"
                  placeholderTextColor="gray"
                  keyboardType="numeric"
                  value={createData.pincode}
                  onChangeText={text => onChange('pincode', text)}
                />
              </View>
            </View>
            <Text style={styles.label}>Plot Size</Text>
            <TextInput
              style={styles.InputField}
              placeholder="Approx Plot Size (in sqft)"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={createData.siteArea}
              onChangeText={text => onChange('plotArea', text)}
            />
            {/* For Material Select */}
            <Text style={styles.label}>Type of Quote</Text>
            <View
              style={[
                styles.InputField,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <RNPickerSelect
                value={materialSelected}
                onValueChange={value => setMaterialSelected(value)}
                items={[
                  {label: 'Labour Rate Only', value: 'Labour Rate Only'},
                  {
                    label: 'Labour Rate + Material',
                    value: 'Labour Rate + Material',
                  },
                ]}
                placeholderTextColor={COLOR.Gray9}
                placeholder={{label: 'Select option', value: null}}
                style={styles.picker}
              />
            </View>

            <View>
              <Text style={styles.label}>Expected Start Date</Text>
              <TouchableOpacity onPress={showStartDatePicker}>
                <TextInput
                  style={styles.InputField}
                  placeholder="Expected Start Date"
                  placeholderTextColor="gray"
                  value={selectedStartDate}
                  editable={false} // Prevent manual text input
                />
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleStartConfirm}
                onCancel={hideStartDatePicker}
                minimumDate={new Date()}
              />
            </View>

            <View>
              <Text style={styles.label}>Last Date for Bidding</Text>
              <TouchableOpacity onPress={showDatePicker}>
                <TextInput
                  style={styles.InputField}
                  placeholder="Last date for bidding"
                  placeholderTextColor="gray"
                  value={selectedDate}
                  editable={false} // Prevent manual text input
                />
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()}
              />
            </View>
            {/* For Project Select */}
            {/* <View
              style={[
                styles.InputField,
                {alignItems: 'center', justifyContent: 'center'},
              ]}>
              <RNPickerSelect
                onValueChange={value => setProjectSelected(value)}
                items={[
                  {label: 'Bungalow', value: 'Bungalow'},
                  {label: 'House', value: 'House'},
                  {label: 'Appartment', value: 'Appartment'},
                ]}
                style={styles.picker}
                placeholder={{label: 'Project', value: null}}
              />
            </View> */}
            <Text style={styles.label}>Upload Plot or Site Images</Text>
            <View style={styles.btnWrap}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUpload}
                activeOpacity={0.9}>
                <View style={styles.uploadView}>
                  <Text style={styles.icon}>☁️</Text>
                  <Text style={styles.uploadTxt}>
                    Upload Plot or Site Images
                  </Text>
                </View>
              </TouchableOpacity>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 10}}>
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

            <Text style={styles.label}>
              Upload BluePrint (Like floor plan, 3D Drawing)
            </Text>
            <View style={styles.btnWrap}>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadPDF}
                activeOpacity={0.9}>
                <View style={styles.uploadView}>
                  <Text style={styles.icon}>📄</Text>
                  <Text style={styles.uploadTxt}>Site Blue Print</Text>
                </View>
              </TouchableOpacity>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 10}}>
                {PdfFiles.length > 0 &&
                  PdfFiles.map((doc, index) => {
                    return (
                      <View>
                        <Pdf source={{uri: doc.uri}} style={styles.pdfStyle} />;
                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => handleRemovePDF(index)}>
                          <Image
                            source={require('../../../../assets/Icons/cross.png')}
                            style={styles.closeIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
              </ScrollView>
            </View>

            <Text style={styles.label}>Description</Text>
            <TextInput
              value={createData.description}
              onChangeText={text => onChange('description', text)}
              placeholderTextColor="gray"
              keyboardType="default"
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              placeholder="Write about your expectations or any special requests."
              style={[styles.InputField, {height: HEIGHT(16)}]}
            />
            <CustomButton
              onPress={() => CreatePewWorkAPI()}
              // disabled={loading} // Disable button when loading
              name="SUBMIT">
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                'SUBMIT'
              )}
            </CustomButton>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default CreatePreWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  label: {
    fontFamily: NotoSans_Medium,
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'left',
    color: COLOR.Black,
    marginBottom: 3,
  },

  InputField: {
    width: WIDTH(91.5),
    height: HEIGHT(6.5),
    marginBottom: HEIGHT(1),
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: COLOR.Gray,
    color: COLOR.Black,
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
    marginBottom: HEIGHT(1),
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
      color: COLOR.Black,
    },
    inputAndroid: {
      fontSize: 16,
      padding: 10,
      color: COLOR.Black,
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

  documentContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  pdfStyle: {
    width: 100,
    height: 85,
  },
  documentName: {
    maxWidth: 100,
    textAlign: 'center',
  },
  pdf: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 5,
  },
});
