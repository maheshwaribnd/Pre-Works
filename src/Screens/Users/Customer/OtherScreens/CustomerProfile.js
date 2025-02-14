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
import React, {useCallback, useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Light,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ApiManager from '../../API/Api';
import EditIcon from '../../../../assets/Svg/edit.svg';
import {Badge} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';

const CustomerProfile = () => {
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [userImage, setuserImage] = useState('');

  const fetchCustomerProfile = async () => {
    try {
      const userID = await AsyncStorage.getItem('userId');
      setUserId(userID);
      console.log('UserID:', userID);

      if (userID) {
        const response = await ApiManager.customerProfile(userID);
        if (response?.data?.status === 200) {
          const customerData = response?.data?.customer;
          setData(customerData);
        }
      }

      const getCustData = await AsyncStorage.getItem('customerData');
      if (getCustData) {
        console.log('getCustData (Raw):', getCustData);
        const parsedData = JSON.parse(getCustData);
        console.log('Parsed Customer Data:', parsedData);
      } else {
        console.log('No customer data found.');
      }
    } catch (error) {
      console.error('Error in fetching data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  // const CustomerProfileAPI = async () => {
  //   await ApiManager.customerProfile(userId)
  //     .then(res => {
  //       if (response?.data?.status === 200) {
  //         const customerData = response?.data?.customer;
  //         setData(customerData);
  //       }
  //     })
  //     .catch(err => console.log(err));
  // };

  // const CustomerUpdateAPI = async () => {
  //   console.log('Updating customer profile...');

  //   const formData = new FormData();
  //   formData.append('name', data.name);
  //   formData.append('email', data.email);
  //   formData.append('mobile_no', data.mobile_no);
  //   formData.append('address', data.address);
  //   formData.append('city', data.city);
  //   formData.append('pincode', data.pincode);
  //   formData.append('state', data.state);

  //   if (documentFile?.length > 0) {
  //     formData.append('profile_image', {
  //       uri: documentFile[0]?.uri,
  //       type: documentFile[0]?.type,
  //       name: documentFile[0]?.fileName,
  //     });
  //   } else if (!data?.profile_image) {
  //     formData.append('profile_image', ''); // Append empty string if no image
  //   }

  //   console.log('FormData:', formData);

  //   try {
  //     const res = await ApiManager.CustomerUpdate(userId, formData);

  //     if (res?.data?.status === 200) {
  //       console.log('Update Success:', res.data);
  //       await AsyncStorage.setItem(
  //         'customerData',
  //         JSON.stringify(res.data.customer),
  //       );
  //       setEdit(false);
  //       Snackbar.show({
  //         text: 'Profile updated successfully!',
  //         duration: Snackbar.LENGTH_SHORT,
  //       });

  //       // Fetch updated profile data after update
  //       fetchCustomerProfile();
  //     } else {
  //       console.warn('Failed to update profile:', res?.data?.message);
  //       Snackbar.show({
  //         text: res?.data?.message || 'Update failed!',
  //         duration: Snackbar.LENGTH_SHORT,
  //       });
  //     }
  //   } catch (err) {
  //     console.error('Error updating profile:', err);
  //     Snackbar.show({
  //       text: 'Something went wrong! Try again.',
  //       duration: Snackbar.LENGTH_SHORT,
  //     });
  //   }
  // };

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

  // const GetCustomerProfile = async () => {
  //   const userID = await AsyncStorage.getItem('userId');
  //   console.log('UserID:', userID);

  //   ApiManager.customerProfile(userID).then((res) => {
  //     console.log('111', res?.data?.customer);

  //   })
  // }

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Profile" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setEdit(!edit);
          }}
          style={styles.edit}>
          <EditIcon color="grey" />
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
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

          <View style={{flexDirection: 'row', gap: 12}}>
            <TextInput
              style={[styles.InputField, {width: WIDTH(44)}]}
              placeholder={data?.city || 'City'}
              editable={edit}
              value={data?.city}
              onChangeText={text => onChange('city', text)}
            />
            <TextInput
              style={[styles.InputField, {width: WIDTH(44)}]}
              keyboardType="number-pad"
              placeholder={data?.pincode || 'Pincode'}
              editable={edit}
              value={data?.pincode}
              onChangeText={text => onChange('pincode', text)}
            />
          </View>

          <TextInput
            style={styles.InputField}
            placeholder={data?.state || 'State'}
            editable={edit}
            value={data?.state}
            onChangeText={text => onChange('state', text)}
          />

          <View style={{marginBottom: HEIGHT(2)}}>
            {edit ? (
              <CustomButton name="SAVE" onPress={() => console.log('update')} />
            ) : null}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default CustomerProfile;

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

  badge: {
    backgroundColor: COLOR.Gray,
    position: 'absolute',
    bottom: 0,
    right: 115,
  },

  edit: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
});
