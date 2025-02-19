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
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [cusId, setCusId] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [userImage, setuserImage] = useState('');
  console.log('cusdata', data);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setCusId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (cusId) {
      CustomerProfileAPI();
    }
  }, [cusId]);

  const CustomerProfileAPI = async () => {
    if (!cusId) return;
    try {
      const res = await ApiManager.customerProfile(cusId);
      if (res?.data?.status === 200) {
        setData({
          name: res.data.customer?.name || '',
          email: res.data.customer?.email || '',
          mobile_no: res.data.customer?.mobile_no || '',
          address: res.data.customer?.address || '',
          city: res.data.customer?.city || '',
          pincode: res.data.customer?.pincode || '',
          state: res.data.customer?.state || '',
          profile_image: res.data.customer?.profile_image || '',
        });
        setuserImage(res.data.customer?.profile_image || '');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const CustomerUpdateAPI = async () => {
    const formData = new FormData();
    formData.append('name', data?.name);
    formData.append('email', data?.email);
    formData.append('mobile_no', data?.mobile_no);
    formData.append('address', data?.address);
    formData.append('city', data?.city);
    formData.append('pincode', data?.pincode);
    formData.append('state', data?.state);

    if (documentFile?.length > 0) {
      formData.append('profile_image', {
        uri: documentFile[0].uri,
        type: documentFile[0].type,
        name: documentFile[0].fileName,
      });
    }

    try {
      setEdit(false);
      const res = await ApiManager.CustomerUpdate(cusId, formData);
      console.log('updated res000', res?.data);

      if (res?.data?.status === 200) {
        console.log('updated res', res?.data);

        setData({
          name: res.data.customer?.name || '',
          email: res.data.customer?.email || '',
          mobile_no: res.data.customer?.mobile_no || '',
          address: res.data.customer?.address || '',
          city: res.data.customer?.city || '',
          pincode: res.data.customer?.pincode || '',
          state: res.data.customer?.state || '',
          profile_image: res.data.customer?.profile_image || '',
        });
        setuserImage(res.data.customer?.profile_image || '');
        await AsyncStorage.setItem(
          'customerData',
          JSON.stringify(res.data.customer),
        );

        Snackbar.show({
          text: res?.data?.message || 'Profile updated successfully!',
          backgroundColor: '#27cc5d',
          duration: Snackbar.LENGTH_SHORT,
        });
      } else {
        Snackbar.show({
          text: res?.data?.message || 'Update failed!',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (err) {
      console.log('Update Error:', err);
    }
  };

  const selectImage = async () => {
    launchImageLibrary({quality: 0.7}, response => {
      if (response?.didCancel) {
        setuserImage('');
        setData(prev => ({...prev, profile_image: ''}));
      } else {
        const img = response?.assets?.[0]?.uri || '';
        if (img) {
          setuserImage(img);
          setData(prev => ({...prev, profile_image: img}));
        }
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
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setEdit(!edit);
            console.log('Edit state:', !edit); // Debugging
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
              style={{width: WIDTH(30), height: WIDTH(30), borderRadius: 50}}
              source={{uri: userImage}}
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
              <CustomButton name="SAVE" onPress={() => CustomerUpdateAPI()} />
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
    // position: 'absolute',
    // top: 10,
    right: 12,
    padding: 10,
  },
});
