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
  windowWidth,
} from '../../../../config/AppConst';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import ApiManager from '../../../../API/Api';
import Swiper from 'react-native-swiper';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const PostBidScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const preId = route?.params?.preId;
  const customerId = route?.params?.customerId;
  const [details, setDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [materialSelected, setMaterialSelected] = useState('');
  const [userId, setUserId] = useState(null);
  const [createData, setCreateData] = useState({
    price: '',
    time: '',
  });

  useEffect(() => {
    PreworkDetailAPI();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  const PreworkDetailAPI = () => {
    ApiManager.NewPreworkById(preId)
      .then(res => {
        if (res?.data?.status === 200) {
          const prework = res?.data?.prework;
          const preworkFiles = res?.data?.preworkfiles;
          setDetails(prework);
          setResImgs(preworkFiles);
        }
      })
      .catch(err => console.log(err));
  };

  const ApplyForBidAPI = () => {
    const formData = new FormData();

    formData.append('contractor_id', userId);
    formData.append('prework_id', preId);
    formData.append('customer_id', customerId);
    formData.append('time', createData.time);
    formData.append('material', materialSelected);
    formData.append('price', createData.price);

    ApiManager.ApplyForBid(formData)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.navigate('contractorTabs');
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
      <CustomHeader name="New Pre-Works Project" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <Swiper
              autoplay
              loop
              showsPagination
              paginationStyle={{bottom: 0}}
              style={styles.imageSlider}>
              {resImgs?.map((item, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{uri: item?.files}} style={styles.image} />
                </View>
              ))}
            </Swiper>
            <View>
              <Text style={styles.title}>{details?.name}</Text>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <CalenderIcon />
                  <Text style={styles.detailText}>{details?.last_date}</Text>
                </View>
                <View style={styles.row}>
                  <MaterialIcon />
                  <Text style={styles.detailText}>{details?.material}</Text>
                </View>
              </View>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <MoneyIcon />
                  <Text style={styles.detailText}>{details?.budget_range}</Text>
                </View>
                <View style={styles.row}>
                  <LocationIcon />
                  <Text style={styles.detailText}>{details?.address}</Text>
                </View>
              </View>

              <TextInput
                style={styles.InputField}
                placeholder="Price"
                placeholderTextColor="gray"
                keyboardType="numeric"
                value={createData.price}
                onChangeText={text => onChange('price', text)}
              />

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
                  // placeholder={{label: 'Labour', value: null}}
                  style={styles.picker}
                />
              </View>
            </View>

            <CustomButton name="Apply" onPress={() => ApplyForBidAPI()} />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default PostBidScreen;

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
    textAlign: 'center',
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
});
