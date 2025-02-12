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
import {HEIGHT, NotoSans_Light, WIDTH} from '../../../config/AppConst';
import COLOR from '../../../config/color.json';
import CustomHeader from '../../../Component/CustomeHeader/CustomHeader';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../../../Component/CustomButton/CustomButton';
import {useNavigation} from '@react-navigation/native';
import ApiManager from '../../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const CreatePreWork = () => {
  const navigation = useNavigation();
  const [id, setId] = useState(null);

  const [documentFile, setDocumentFile] = useState(null);
  const [uploadImg, setUploadImg] = useState('');
  const [createData, setCreateData] = useState({
    name: '',
    siteAddress: '',
    city: '',
    pincode: '',
    siteArea: '',
    material: '',
    budgetRange: '',
    dateForBidding: '',
    customBid: '',
    Projects: '',
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

  const CreatePewWorkAPI = async () => {
    const formData = new FormData();

    formData.append('name', createData.name);
    formData.append('address', createData.siteAddress);
    formData.append('last_date', createData.dateForBidding);
    formData.append('city', createData.city);
    formData.append('pincode', createData.pincode);
    formData.append('site_area', createData.siteArea);
    formData.append('material', createData.material);
    formData.append('budget_range', createData.budgetRange);
    formData.append('custombid', createData.customBid);
    formData.append('projects', createData.Projects);
    formData.append('customer_id', id);
    formData.append('description', createData.description);

    if (documentFile && documentFile.length > 0) {
      formData.append('upload_image', {
        uri: documentFile[0].uri,
        type: documentFile[0].type,
        name: documentFile[0].fileName,
      });
    } else {
      formData.append('upload_image', undefined);
    }

    await ApiManager.createPreWork(formData)

      .then(res => {
        if (res?.data?.status == 200) {
          console.log('cp333', res?.data);
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
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
    // navigation.navigate('customerTabs');
  };

  const handleUpload = async () => {
    try {
      launchImageLibrary({quality: 0.7}, fileobj => {
        if (fileobj?.didCancel === true) {
          setUploadImg('');
        } else {
          const img = fileobj?.assets[0]?.uri || '';
          setUploadImg(img);
          setDocumentFile(fileobj?.assets);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while selecting the image.');
    }
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Create Pre-works" />
      <ImageBackground
        source={require('../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{paddingVertical: HEIGHT(3), alignItems: 'center'}}>
            <TextInput
              style={styles.InputField}
              placeholder="Name"
              keyboardType="text"
              value={createData.name}
              onChangeText={text => onChange('name', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Site Address"
              value={createData.siteAddress}
              onChangeText={text => onChange('siteAddress', text)}
            />

            <View style={styles.experienceView}>
              <TextInput
                style={[styles.InputField, {width: WIDTH(44)}]}
                placeholder="City"
                keyboardType="default"
                value={createData.city}
                onChangeText={text => onChange('city', text)}
              />
              <TextInput
                style={[styles.InputField, {width: WIDTH(44)}]}
                placeholder="Pincode"
                keyboardType="numeric"
                value={createData.pincode}
                onChangeText={text => onChange('pincode', text)}
              />
            </View>

            <TextInput
              style={styles.InputField}
              placeholder="Site Area"
              keyboardType="numeric"
              value={createData.siteArea}
              onChangeText={text => onChange('siteArea', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Material"
              value={createData.material}
              onChangeText={text => onChange('material', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Budget Range"
              keyboardType="numeric"
              value={createData.budgetRange}
              onChangeText={text => onChange('budgetRange', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Last date for biding"
              value={createData.dateForBidding}
              onChangeText={text => onChange('dateForBidding', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Custom Bid"
              keyboardType="numeric"
              value={createData.customBid}
              onChangeText={text => onChange('customBid', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder="Projects"
              value={createData.Projects}
              onChangeText={text => onChange('Projects', text)}
            />

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  marginVertical: HEIGHT(1),
                  backgroundColor: '#fff',
                }}
                onPress={handleUpload}
                activeOpacity={0.9}>
                <View style={styles.uploadView}>
                  <Text style={styles.icon}>☁️</Text>
                  <Text style={styles.uploadTxt}>
                    Upload Preview Work Images
                  </Text>
                </View>
              </TouchableOpacity>

              <View>
                {uploadImg ? (
                  <Image
                    source={{uri: uploadImg}}
                    style={{width: 70, height: 70}}
                  />
                ) : null}
              </View>
            </View>

            <TextInput
              value={createData.description}
              onChangeText={text => onChange('description', text)}
              keyboardType="default"
              multiline={true}
              numberOfLines={10}
              textAlignVertical="top"
              placeholder="Description"
              style={[styles.InputField, {height: HEIGHT(25)}]}
            />

            <CustomButton name="SUBMIT" onPress={() => CreatePewWorkAPI()} />
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

  uploadTxt: {
    fontFamily: NotoSans_Light,
    fontSize: 11,
    color: COLOR.Gray9,
    width: WIDTH(25),
    textAlign: 'center',
  },
});
