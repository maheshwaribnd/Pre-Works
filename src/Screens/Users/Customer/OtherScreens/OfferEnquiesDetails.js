import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import COLOR from '../../../../config/color.json';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import Swiper from 'react-native-swiper';
import Time from '../../../../assets/Svg/Time.svg';
import Experience from '../../../../assets/Svg/Experience.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import Currency from '../../../../assets/Svg/currency.svg';
import Mobile from '../../../../assets/Svg/Mobile.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import LinearGradient from 'react-native-linear-gradient';
import BidModal from '../../../../Component/BidModal/BidModal';

import AsyncStorage from '@react-native-async-storage/async-storage';

const OfferEnquiesDetails = () => {
  const route = useRoute();
  const contractorID = route?.params?.contractorID;
  console.log('contractorIDcontractorID', contractorID);

  const [cusId, setCusId] = useState('');
  const [contractorDetails, setContractorDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);

  const [Accept, setAccept] = useState(false);
  const [Reject, setReject] = useState(false);
  console.log('1230el', contractorDetails);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setCusId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (cusId) {
      EnquiresListAPI();
    }
  }, [cusId]);

  const EnquiresListAPI = () => {
    ApiManager.EnquiryDetailsById(contractorID)
      .then(res => {
        if (res?.data?.status === 200) {
          const response = res?.data?.contractorDetail;
          const images = res?.data?.contractorImage;
          setContractorDetails(response);
          setResImgs(images);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const GradientButton = ({text, colors, onPress}) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <LinearGradient
          activeOpacity={0.4}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={colors}
          style={styles.button}>
          <Text style={styles.buttonText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Offer Enquiries" />
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
              <Text style={styles.title}>
                {contractorDetails?.contractor_name}
              </Text>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <Mobile />
                  <Text style={styles.detailText}>
                    {contractorDetails?.contractor_mobile}
                  </Text>
                </View>
                <View style={styles.row}>
                  <MaterialIcon />
                  <Text style={styles.detailText}>
                    {contractorDetails?.contractor_material}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <Time />
                  <Text style={styles.detailText}>
                    {contractorDetails?.contractor_time}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Currency />
                  <Text style={styles.detailText}>
                    {contractorDetails?.contractor_price}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <LocationIcon />
                <Text style={styles.detailText}>
                  {contractorDetails?.contractor_worklocation}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                  {contractorDetails?.description}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <GradientButton
                  text="REJECT"
                  colors={['#CF310A', '#F68740']}
                  onPress={() => setReject(true)}
                />

                <GradientButton
                  text="ACCEPT"
                  colors={['#029A49', '#0BDB8D']}
                  onPress={() => setAccept(true)}
                />
              </View>
              {Reject ? (
                <BidModal
                  heading="Are you Sure, cancle to here"
                  showModal={Reject}
                  setShowModal={setCancel}
                  name="REJECT"
                  color={['#F78941', '#D2390F']}
                  onPress={() => setReject(!cancel)}
                />
              ) : null}

              {Accept ? (
                <BidModal
                  heading="Are you Sure, do you want to go with this bid now"
                  showModal={Accept}
                  setShowModal={setReject}
                  name="ACCEPT"
                  color={['#0AD788', '#03A151']}
                  //   onPress={() =>
                  //     navigation.navigate('postbidscreen', {
                  //       preId: preId,
                  //       customerId: details?.customer_id,
                  //     })
                  //   }
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default OfferEnquiesDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  cardWrapper: {
    // backgroundColor: COLOR.White,
    // elevation: 5,
    borderRadius: 16,
    marginVertical: HEIGHT(3),
    marginHorizontal: HEIGHT(1),
    // overflow: 'hidden',
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
    paddingVertical: WIDTH(2),
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
});
