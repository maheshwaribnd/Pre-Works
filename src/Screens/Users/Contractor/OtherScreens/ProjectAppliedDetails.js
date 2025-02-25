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
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import COLOR from '../../../../config/color.json';
import Swiper from 'react-native-swiper';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import ApiManager from '../../../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import Snackbar from 'react-native-snackbar';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import HeaderWithEdit from '../../../../Component/CustomeHeader/HeaderWithEdit';

const ProjectAppliedDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const preId = route?.params?.PreId;

  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState('');
  const [appliedDetails, setAppliedDetails] = useState([]);

  const [resImgs, setResImgs] = useState([]);
  const [materialSelected, setMaterialSelected] = useState('');
  const [createData, setCreateData] = useState({
    price: '',
    time: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      ProjectAppliedDetailAPI();
    }
  }, [userId]);

  const ProjectAppliedDetailAPI = () => {
    ApiManager.ProjectAppliedDetails(preId, userId).then(res => {
      if (res?.data?.status === 200) {
        const appliedResponse = res?.data?.contractor;
        const imgResponse = res?.data?.preworkFiles;
        setCreateData(appliedResponse);
        setAppliedDetails(appliedResponse);
        setResImgs(imgResponse);
      }
    });
  };

  const AppliedProjectEditAPI = () => {
    const formData = new FormData();

    formData.append('time', createData.time);
    formData.append('material', materialSelected);
    formData.append('price', createData.price);
    console.log('preId, userId, formData', preId, userId, formData);

    ApiManager.AppliedProjectEdit(preId, userId, formData)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.success,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          setEdit(false);
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
    <View style={{flex: 1}}>
      <HeaderWithEdit name="Project Applied" edit={edit} setEdit={setEdit} />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardWrapper}>
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
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>{appliedDetails?.name}</Text>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <CalenderIcon />
                  <Text style={styles.detailText}>
                    {appliedDetails?.last_date}
                  </Text>
                </View>
                <View style={styles.row}>
                  <MaterialIcon />
                  <Text style={styles.detailText}>
                    {appliedDetails?.material}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <MoneyIcon />
                  <Text style={styles.detailText}>
                    {appliedDetails?.budget_range}
                  </Text>
                </View>
                <View style={styles.row}>
                  <LocationIcon />
                  <Text style={styles.detailText}>
                    {appliedDetails?.address}
                  </Text>
                </View>
                {/* <View style={styles.row}>
                <BiddingIcon />
                <Text style={styles.detailText}>{appliedDetails?.custombid}</Text>
              </View> */}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                  {appliedDetails?.description}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>My Bid Info</Text>

              <TextInput
                style={styles.InputField}
                placeholder={String(createData?.price ?? '')}
                placeholderTextColor="gray"
                keyboardType="numeric"
                editable={edit}
                value={String(createData?.price ?? '')}
                onChangeText={text => onChange('price', text)}
              />

              <TextInput
                style={styles.InputField}
                value={createData?.time}
                placeholder={createData?.time}
                placeholderTextColor="gray"
                editable={edit}
                keyboardType="default"
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
                  placeholder={{
                    label: appliedDetails?.material,
                    value: appliedDetails?.material,
                  }}
                  style={styles.picker}
                  disabled={!edit}
                  dropdownItemStyle={{color: 'black'}}
                />
              </View>

              {edit ? (
                <CustomButton
                  name="Update"
                  onPress={() => AppliedProjectEditAPI()}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ProjectAppliedDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  cardWrapper: {
    backgroundColor: COLOR.White,
    borderRadius: 16,
    elevation: 5,
    marginVertical: HEIGHT(3),
    marginHorizontal: HEIGHT(1),

    overflow: 'hidden',
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
    width: WIDTH(81),
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
