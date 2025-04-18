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
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../../../config/AppConst';
import COLOR from '../../../../config/color.json';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddIcon from '../../../../assets/Svg/AddIcon.svg';
import {Badge} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import ApiManager from '../../../../API/Api';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import {launchImageLibrary} from 'react-native-image-picker';
import HeaderWithEdit from '../../../../Component/CustomeHeader/HeaderWithEdit';
import {useNavigation} from '@react-navigation/native';

const ContractorProfile = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState('');
  const [workList, setWorkList] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [userImage, setuserImage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      CustomerProfileAPI();
      ContractorWorkListAPI();
    }
  }, [userId]);

  const CustomerProfileAPI = async () => {
    if (!userId) return;
    try {
      const res = await ApiManager.ContractorProfile(userId);
      if (res?.data?.status === 200) {
        setData(res?.data?.['contractors ']);
        setuserImage(res?.data?.['contractors ']?.profile_image || '');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ContractorUpdateAPI = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', data?.name);
    formData.append('email', data?.email);
    formData.append('mobile_no', data?.mobile_no);
    formData.append('address', data?.address);
    formData.append('experience', data?.experience);

    if (documentFile?.length > 0) {
      formData.append('profile_image', {
        uri: documentFile[0].uri,
        type: documentFile[0].type,
        name: documentFile[0].fileName,
      });
    }

    try {
      setEdit(false);
      const res = await ApiManager.ContractorUpdate(userId, formData);

      if (res?.data?.status === 200) {
        Snackbar.show({
          text: res?.data?.message || 'Profile updated successfully!',
          backgroundColor: '#27cc5d',
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      } else {
        Snackbar.show({
          text: res?.data?.message || 'Update failed!',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      }
    } catch (err) {
      console.log('Update Error:', err);
      setLoading(false);
    }
  };

  const ContractorWorkListAPI = () => {
    ApiManager.ContractorWorkListing(userId)
      .then(res => {
        if (res?.data?.status === 200) {
          const list = res?.data?.data;
          setWorkList(list);
        }
      })
      .catch(err => {
        console.log(err);
      });
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

  const onChange = (key, value) => {
    setData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View style={{flex: 1}}>
      <HeaderWithEdit name="Profile" edit={edit} setEdit={setEdit} />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
            <View
              style={{
                // paddingTop: HEIGHT(3),
                paddingBottom: HEIGHT(1),
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: WIDTH(30),
                  height: WIDTH(30),
                  borderRadius: 50,
                  borderWidth: 0.5,
                }}
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
          </View>

          <TextInput
            style={styles.InputField}
            placeholder={data?.name}
            placeholderTextColor="gray"
            editable={edit}
            value={data?.name}
            onChangeText={text => onChange('name', text)}
          />

          <TextInput
            style={styles.InputField}
            keyboardType="number-pad"
            placeholderTextColor="gray"
            placeholder={data?.mobile_no}
            editable={edit}
            value={data?.mobile_no}
            onChangeText={text => onChange('mobile_no', text)}
          />

          <TextInput
            style={styles.InputField}
            placeholder={data?.email}
            placeholderTextColor="gray"
            editable={edit}
            value={data?.email}
            onChangeText={text => onChange('email', text)}
          />

          <TextInput
            style={styles.InputField}
            placeholder={data?.address || 'Address'}
            placeholderTextColor="gray"
            editable={edit}
            value={data?.address}
            onChangeText={text => onChange('address', text)}
          />

          <TextInput
            style={styles.InputField}
            keyboardType="number-pad"
            placeholderTextColor="gray"
            placeholder={data?.experience}
            editable={edit}
            value={data?.experience}
            onChangeText={text => onChange('experience', text)}
          />

          {edit ? (
            <View style={{paddingBottom: HEIGHT(1)}}>
              <Text style={styles.myWorkTxt}>My Work</Text>
              <View style={styles.btnWrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {workList.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        navigation.navigate('contractorworkdetails', {
                          workId: item?.id,
                        })
                      }
                      style={styles.workItem}>
                      <Image
                        source={{uri: item?.images[0]?.files}}
                        style={styles.workImage}
                      />
                      <Text style={styles.workText}>
                        {item.name || 'No Name'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.myWorkButton}
                  onPress={() => navigation.navigate('contractormywork')}
                  activeOpacity={0.9}>
                  <View style={styles.myWorkView}>
                    <AddIcon height={45} width={45} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          <View style={{marginBottom: HEIGHT(2)}}>
            {edit ? (
              <CustomButton
                name="SAVE"
                onPress={() => ContractorUpdateAPI()}
                loading={loading}
                disabled={loading}
              />
            ) : null}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ContractorProfile;

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

  badge: {
    backgroundColor: COLOR.Gray,
    position: 'absolute',
    bottom: 0,
    right: 2,
  },

  btnWrap: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },

  myWorkView: {
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

  workItem: {
    alignItems: 'center',
    width: 100,
    height: 100,
    marginRight: 10,
    backgroundColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
  },

  workImage: {
    width: 100,
    height: 80,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },

  workText: {
    color: '#fff',
    fontSize: 14,
    // paddingVertical: 5,
  },

  myWorkButton: {
    alignItems: 'center',
    marginVertical: HEIGHT(1),
    backgroundColor: '#fff',
  },

  myWorkTxt: {
    fontFamily: NotoSans_Medium,
    fontSize: 16,
    color: COLOR.PrimaryDarkColor,
    width: WIDTH(25),
    textAlign: 'left',
  },

  myWorkButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  edit: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
});
