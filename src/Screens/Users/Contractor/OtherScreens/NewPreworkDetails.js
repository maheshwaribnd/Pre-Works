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
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import LinearGradient from 'react-native-linear-gradient';
import BidModal from '../../../../Component/BidModal/BidModal';
import Snackbar from 'react-native-snackbar';

const NewPreworkDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const preId = route?.params?.preworkId;
  const isexpired = route?.params?.expired;
  const [details, setDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [bid, setBid] = useState(false);
  const [cancel, setCancel] = useState(false);

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

  // const BidFunction = () => {
  //   if (isexpired) {
  //     setBid(false);
  //     Snackbar.show({
  //       text: 'This Prework is Expired!',
  //       backgroundColor: '#D1264A',
  //       duration: Snackbar.LENGTH_SHORT,
  //     });
  //   } else {
  //     setBid(true);
  //   }
  // };

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
              autoplay={true}
              loop
              showsPagination={true}
              style={{height: 240}}
              paginationStyle={{bottom: 0}}>
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
                  <Text style={[styles.detailText, {width: WIDTH(32)}]}>
                    {details?.material}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <LocationIcon />
                  <Text style={[styles.detailText, {width: WIDTH(32)}]}>
                    {details?.address}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{details?.description}</Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <GradientButton
                  text="SEND YOUR QUOTATION"
                  colors={['#029A49', '#0BDB8D']}
                  onPress={() =>
                    navigation.navigate('postbidscreen', {
                      preId: preId,
                      customerId: details?.customer_id,
                    })
                  }
                />
              </View>
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
    marginBottom: 2,
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
    width: WIDTH(80),
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
