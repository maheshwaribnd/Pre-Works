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
import CalenderIcon from '../../../../assets//Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import {ActivityIndicator} from 'react-native-paper';

const OpenPreworkDetails = () => {
  const route = useRoute();
  const PreworkId = route?.params?.preworkId;

  const [data, setData] = useState([]);
  const [resImgs, setResImgs] = useState([]);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    PreWorkByIdAPI();
  }, []);

  const PreWorkByIdAPI = async () => {
    try {
      setLoader(true);
      const res = await ApiManager.OpenPreworkById(PreworkId);
      if (res?.data?.status === 200) {
        setResImgs(res?.data?.preworkfiles || []);
        setData(res?.data?.prework || []);
        setLoader(false);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <CustomHeader name="Open Pre-Works" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {loader ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.contentWrapper}>
              {/* Swiper for Images */}
              <Swiper
                autoplay
                loop
                showsPagination
                style={{height: 240}} // Make sure it has height
                paginationStyle={{bottom: 0}}>
                {resImgs.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={{uri: item?.files}} style={styles.imgs} />
                  </View>
                ))}
              </Swiper>

              {/* Title */}
              <Text style={styles.nametitle}>{data?.name}</Text>

              {/* Details Section */}
              <View style={styles.detailsContainer}>
                <View style={styles.row}>
                  <CalenderIcon />
                  <Text style={styles.detailText}>{data?.last_date}</Text>
                </View>
                <View style={styles.row}>
                  <MaterialIcon />
                  <Text style={styles.detailText}>{data?.material}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.row}>
                  <MoneyIcon />
                  <Text style={styles.detailText}>{data?.budget_range}</Text>
                </View>
                <View style={styles.row}>
                  <LocationIcon />
                  <Text style={[styles.detailText, {width: WIDTH(35)}]}>
                    {data?.address}
                  </Text>
                  {/* <BiddingIcon />
                  <Text style={styles.detailText}>{data?.custombid}</Text> */}
                </View>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{data?.description}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default OpenPreworkDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },

  contentWrapper: {
    padding: WIDTH(2),
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: windowWidth * 0.9,
    height: HEIGHT(30),
    resizeMode: 'cover',
    borderRadius: 10,
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
  },
  noImageText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLOR.Gray,
    marginVertical: HEIGHT(5),
  },
  nametitle: {
    fontFamily: Montserrat_bold,
    fontSize: 22,
    textAlign: 'center',
    color: COLOR.Black,
    marginVertical: HEIGHT(2),
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: COLOR.LightGray,
    borderRadius: 8,
    paddingHorizontal: WIDTH(4),
    marginVertical: HEIGHT(0.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WIDTH(2),
    marginVertical: HEIGHT(1),
  },
  detailText: {
    fontSize: 16,
    fontFamily: Montserrat_Medium,
    color: COLOR.Gray,
  },
  section: {
    marginVertical: HEIGHT(2),
    marginHorizontal: WIDTH(4),
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

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250, // Adjust height as needed
    resizeMode: 'cover', // Ensure images are displayed properly
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
  },
  imgs: {
    width: 330,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 9,
    marginBottom: HEIGHT(4),
  },
});
