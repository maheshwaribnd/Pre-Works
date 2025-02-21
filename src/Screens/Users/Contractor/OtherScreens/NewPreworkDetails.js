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
import {useRoute} from '@react-navigation/native';
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
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import LinearGradient from 'react-native-linear-gradient';
import BidModal from '../../../../Component/BidModal/BidModal';

const NewPreworkDetails = () => {
  const route = useRoute();
  const preId = route?.params?.preworkId;
  const [details, setDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [bid, setBid] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showCancleModal, setCancleShowModal] = useState(false);

  useEffect(() => {
    PreworkDetailAPI();
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
      <CustomHeader name="New Pre-Works Project" />
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
                {/* <View style={styles.row}>
                  <BiddingIcon />
                  <Text style={styles.detailText}>{details?.custombid}</Text>
                </View> */}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{details?.description}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <GradientButton
                  text="CANCEL"
                  colors={['#CF310A', '#F68740']}
                  onPress={() => setCancel(true)}
                />

                <GradientButton
                  text="BID NOW"
                  colors={['#029A49', '#0BDB8D']}
                  onPress={() => setBid(true)}
                />
              </View>
              {cancel ? (
                <BidModal
                  heading="Are you Sure, cancle to here"
                  showModal={cancel}
                  setShowModal={setCancel}
                />
              ) : null}

              {bid ? (
                <BidModal
                  heading="Are you Sure, do you want to go with this bid now"
                  showModal={bid}
                  setShowModal={setBid}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default NewPreworkDetails;

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
});
