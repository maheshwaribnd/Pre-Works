import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../../../config/color.json';
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRoute} from '@react-navigation/native';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import {Badge} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import Snackbar from 'react-native-snackbar';

const Profile = () => {
  const route = useRoute();
  const edit = route?.params?.edit;
  const setEdit = route?.params?.setEdit;

  const [data, setData] = useState([]);
  const [userId, setUserId] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [userImage, setuserImage] = useState('');
  const [backgdDocumentFile, setbackgdDocumentFile] = useState(null);
  const [userBackImg, setUserBackImg] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      ArchitectProfileAPI();
    }
  }, [userId]);

  const ArchitectProfileAPI = async () => {
    if (!userId) return;
    try {
      const res = await ApiManager.ArchitectProfile(userId);
      if (res?.data?.status === 200) {
        const architectData = res?.data?.['architecture '];

        setData({
          name: architectData?.name || '',
          email: architectData?.email || '',
          mobile_no: architectData?.mobile_no || '',
          address: architectData?.address || '',
          experience: architectData?.experience || '',
          whatsup_no: architectData?.whatsup_no || '',
          instagram_link: architectData?.instagram_link || '',
          about_us: architectData?.about_us || '',
        });
        setuserImage(architectData?.profile_image || '');
        setUserBackImg(architectData?.background_img);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ArchitectUpdateAPI = async () => {
    const formData = new FormData();
    formData.append('name', data?.name);
    formData.append('mobile_no', data?.mobile_no);
    formData.append('email', data?.email);
    formData.append('address', data?.address);
    formData.append('experience', data?.experience);
    formData.append('whatsup_no', data?.whatsup_no);
    formData.append('about_us', data?.about_us);
    formData.append('instagram_link', data?.instagram_link);

    if (documentFile?.length > 0) {
      formData.append('profile_image', {
        uri: documentFile[0].uri,
        type: documentFile[0].type,
        name: documentFile[0].fileName,
      });
    }
    if (backgdDocumentFile?.length > 0) {
      formData.append('background_img', {
        uri: backgdDocumentFile[0].uri,
        type: backgdDocumentFile[0].type,
        name: backgdDocumentFile[0].fileName,
      })
    }

    try {
      const res = await ApiManager.ArchitectUpdate(userId, formData);
      if (res?.data?.status === 200) {
        setEdit(false);

        Snackbar.show({
          text: res?.data?.message,
          backgroundColor: '#27cc5d',
          duration: Snackbar.LENGTH_SHORT,
        })
        // setData({
        //   name: res.data.customer?.name || '',
        //   email: res.data.customer?.email || '',
        //   mobile_no: res.data.customer?.mobile_no || '',
        //   address: res.data.customer?.address || '',
        //   city: res.data.customer?.city || '',
        //   pincode: res.data.customer?.pincode || '',
        //   state: res.data.customer?.state || '',
        //   profile_image: res.data.customer?.profile_image || '',
        // });
        // setuserImage(res.data.customer?.profile_image || '');
        // await AsyncStorage.setItem(
        //   'customerData',
        //   JSON.stringify(res.data.customer),
        // );

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

  const selectBackfroundImage = async () => {
    launchImageLibrary({quality: 0.7}, fileobj => {
      if (fileobj?.didCancel === true) {
        setUserBackImg('');
        // setUserData(prev => ({...prev, img: ''})); // Update userData
      } else {
        const img = fileobj?.assets[0]?.uri || '';
        setUserBackImg(img);
        // setUserData(prev => ({...prev, img})); // Update userData
        setbackgdDocumentFile(fileobj?.assets);
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{paddingTop: HEIGHT(2), alignItems: 'center'}}>
            <View style={styles.profileContainer}>
              <Image source={{uri: userBackImg}} style={styles.bgImage} />
              {edit ? (
                <Badge
                  onPress={() => selectBackfroundImage()}
                  size={32}
                  style={styles.backBadge}>
                  <Octicons size={18} name="pencil" />
                </Badge>
              ) : null}
              <View style={styles.profileWrapper}>
                <Image source={{uri: userImage}} style={styles.profilePic} />
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
              keyboardType="decimal-pad"
              editable={edit}
              value={data?.email}
              onChangeText={text => onChange('email', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder={data?.address || 'Address'}
              editable={edit}
              keyboardType="decimal-pad"
              value={data?.address}
              onChangeText={text => onChange('address', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder={data?.experience || 'Experience'}
              keyboardType="number-pad"
              editable={edit}
              value={data?.experience}
              onChangeText={text => onChange('experience', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder={data?.whatsup_no || 'WhatsApp No'}
              editable={edit}
              keyboardType="number-pad"
              value={data?.whatsup_no}
              onChangeText={text => onChange('whatsup_no', text)}
            />

            <TextInput
              style={styles.InputField}
              placeholder={data?.instagram_link || 'Instagram'}
              editable={edit}
              keyboardType="default"
              value={data?.instagram_link}
              onChangeText={text => onChange('instagram_link', text)}
            />

            <TextInput
              style={[
                styles.InputField,
                {height: HEIGHT(25), textAlign: 'justify'},
              ]}
              placeholder={data?.about_us || 'About Us'}
              editable={edit}
              keyboardType="default"
              value={data?.about_us}
              onChangeText={text => onChange('about_us', text)}
            />

            <View style={{marginBottom: HEIGHT(2)}}>
              {!edit ? (
                <CustomButton
                  name="SAVE"
                  onPress={() => ArchitectUpdateAPI()}
                />
              ) : null}
            </View>
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

  profileContainer: {
    alignItems: 'center',
    width: '100%',
  },
  bgImage: {
    width: '100%',
    height: HEIGHT(25),
    borderWidth: 0.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderColor: COLOR.Gray,
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -HEIGHT(7),
    paddingHorizontal: WIDTH(5),
  },
  profilePic: {
    width: WIDTH(25),
    height: WIDTH(25),
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLOR.White,
  },
  profileInfo: {
    marginLeft: WIDTH(6),
    marginTop: HEIGHT(7),
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

  badge: {
    backgroundColor: COLOR.Gray,
    position: 'absolute',
    bottom: 0,
    right: 25,
  },

  backBadge: {
    backgroundColor: COLOR.Gray,
    position: 'absolute',
    bottom: 20,
    right: 25,
  },
});
