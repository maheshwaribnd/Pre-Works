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
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import Time from '../../../../assets/Svg/Time.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import ApiManager from '../../../../API/Api';
import Swiper from 'react-native-swiper';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import HeaderWithEdit from '../../../../Component/CustomeHeader/HeaderWithEdit';

const ContractorWorkDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const workId = route?.params?.workId;
  const [details, setDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [edit, setEdit] = useState(false);
  const [materialSelected, setMaterialSelected] = useState('');
  const [userId, setUserId] = useState(null);
  const [createData, setCreateData] = useState({
    price: '',
    time: '',
  });

  useEffect(() => {
    ContractorWorkDetailAPI();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  const ContractorWorkDetailAPI = () => {
    ApiManager.ContractorParticularWork(workId)
      .then(res => {
        if (res?.data?.status === 200) {
          const contractorwork = res?.data?.contractorwork;
          const workFiles = res?.data?.images;
          setDetails(contractorwork);
          setResImgs(workFiles);
        }
      })
      .catch(err => console.log(err));
  };

  const UpdateCustomerWork = () => {
    const formData = new FormData();

    formData.append('contractor_id', userId);
    formData.append('time', createData.time);
    formData.append('material', materialSelected);
    formData.append('price', createData.price);

    ApiManager.ContractorWorUpdate(workId, formData)
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

  const onChange = (key, value) => {
    setCreateData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <HeaderWithEdit
        name="New Pre-Works Project"
        edit={edit}
        setEdit={setEdit}
      />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            {resImgs?.length > 0 ? (
              <Swiper
                autoplay
                loop
                showsPagination
                style={{height: 240}}
                paginationStyle={{bottom: 0}}>
                {resImgs?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{uri: item?.files || 'fallback_image_url'}}
                      style={styles.imgs}
                    />
                  </View>
                ))}
              </Swiper>
            ) : (
              <Text style={styles.noImageText}>No Image</Text>
            )}

            <View>
              <Text style={styles.title}>{details?.name}</Text>
              <View style={styles.row}>
                <Time />
                <Text style={styles.detailText}>{details?.time}</Text>
              </View>
              <View style={styles.row}>
                <MaterialIcon />
                <Text style={styles.detailText}>{details?.material}</Text>
              </View>
              <View style={styles.row}>
                <MoneyIcon />
                <Text style={styles.detailText}>{details?.price}</Text>
              </View>
              <View style={styles.row}>
                <LocationIcon />
                <Text style={styles.detailText}>{details?.address}</Text>
              </View>

              <TextInput
                style={styles.InputField}
                placeholder="Price"
                placeholderTextColor="gray"
                keyboardType="numeric"
                editable={edit}
                value={createData.price}
                onChangeText={text => onChange('price', text)}
              />

              <TextInput
                style={styles.InputField}
                placeholder="Time"
                placeholderTextColor="gray"
                keyboardType="default"
                editable={edit}
                value={createData.time}
                onChangeText={text => onChange('time', text)}
              />

              <View style={styles.InputField}>
                <RNPickerSelect
                  onValueChange={value => setMaterialSelected(value)}
                  items={[
                    {label: 'Labour', value: 'Labour'},
                    {label: 'Labour + Material', value: 'Labour + Material'},
                  ]}
                  placeholderTextColor={COLOR.Gray9}
                  placeholder={{label: 'Select Material', value: null}}
                  value={materialSelected} // Ensure selected value is shown
                  style={{
                    inputIOS: styles.pickerInput,
                    inputAndroid: styles.pickerInput,
                  }}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            </View>

            {edit ? (
              <CustomButton
                name="Update"
                onPress={() => UpdateCustomerWork()}
              />
            ) : null}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ContractorWorkDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(1),
  },

  contentWrapper: {
    padding: WIDTH(2),
  },

  imageSlider: {
    height: 240,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 9,
  },
  contentWrapper: {
    padding: WIDTH(4),
  },
  title: {
    fontFamily: Montserrat_bold,
    fontSize: 22,
    color: COLOR.Black,
    textAlign: 'left',
    marginBottom: HEIGHT(2),
  },
  detailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: HEIGHT(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WIDTH(2),
    marginBottom: HEIGHT(1),
  },
  detailText: {
    fontSize: 16,
    fontFamily: Montserrat_Medium,
    color: COLOR.Gray,
  },
  section: {
    marginVertical: HEIGHT(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Montserrat_bold,
    color: COLOR.Black,
    marginBottom: HEIGHT(1),
  },
  description: {
    fontSize: 14,
    fontFamily: Montserrat_Medium,
    color: COLOR.Gray,
    lineHeight: 22,
  },
  buttonContainer: {
    margin: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: NotoSans_Medium,
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

  imgs: {
    width: 330,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 9,
    marginBottom: HEIGHT(4),
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
});
