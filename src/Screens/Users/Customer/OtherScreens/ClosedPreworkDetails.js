import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../../../config/color.json';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  WIDTH,
  windowWidth,
} from '../../../../config/AppConst';
import ApiManager from '../../../../API/Api';
import {useRoute} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';

const ClosedPreworkDetails = () => {
  const route = useRoute();
  const PreworkId = route?.params?.preworkId;

  const [data, setData] = useState(null);
  const [resImgs, setResImgs] = useState([]);

  useEffect(() => {
    ClosedPreWorkByIdAPI();
  }, []);

  const ClosedPreWorkByIdAPI = () => {
    ApiManager.ClosedPreworkById(PreworkId).then(res => {
      if (res?.data?.status === 200) {
        setData(res?.data?.prework);
        setResImgs(res?.data?.preworkfiles);
      }
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <CustomHeader name="Closed Pre-Works Requirement" />
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
              {resImgs.map((item, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{uri: item?.files}} style={styles.image} />
                </View>
              ))}
            </Swiper>
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>{data?.name}</Text>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <CalenderIcon />
                  <Text style={styles.detailText}>{data?.last_date}</Text>
                </View>
                <View style={styles.row}>
                  <MaterialIcon />
                  <Text style={styles.detailText}>{data?.material}</Text>
                </View>
              </View>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <MoneyIcon />
                  <Text style={styles.detailText}>{data?.budget_range}</Text>
                </View>
                <View style={styles.row}>
                  <BiddingIcon />
                  <Text style={styles.detailText}>{data?.custombid}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <LocationIcon />
                <Text style={styles.detailText}>{data?.address}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{data?.description}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ClosedPreworkDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  cardWrapper: {
    backgroundColor: COLOR.White,
    borderRadius: 16,
    elevation: 5,
    margin: HEIGHT(3),
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
});
