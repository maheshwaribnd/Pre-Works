import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import COLOR from '../../../../config/color.json';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  WIDTH,
  windowWidth,
} from '../../../../config/AppConst';
import {useRoute} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import Time from '../../../../assets//Svg/Time.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import {ActivityIndicator} from 'react-native-paper';

const ArchitectPastPreworkDetails = () => {
  const route = useRoute();
  const itemDetails = route?.params?.item;
  const itemImages = route?.params?.images;
  const loader = route?.params?.loader;

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <CustomHeader name={itemDetails?.name} />
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
              {itemImages?.length > 0 ? (
                <Swiper
                  autoplay
                  loop
                  showsPagination
                  style={{height: 240}}
                  paginationStyle={{bottom: 0}}>
                  {itemImages?.map((item, index) => (
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

              {/* Title */}
              <Text style={styles.nametitle}>{itemDetails?.site_name}</Text>

              {/* Details Section */}
              <View style={styles.detailsContainer}>
                <View style={styles.row}>
                  <Time />
                  <Text style={styles.detailText}>
                    {itemDetails?.time} Months
                  </Text>
                </View>

                <View style={styles.row}>
                  <MoneyIcon />
                  <Text style={styles.detailText}>{itemDetails?.cost}</Text>
                </View>

                <View style={styles.row}>
                  <LocationIcon />
                  <Text style={styles.detailText}>{itemDetails?.address}</Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                  {itemDetails?.description}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ArchitectPastPreworkDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },

  contentWrapper: {
    padding: WIDTH(4),
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
    textAlign: 'left',
    color: COLOR.Black,
    marginTop: HEIGHT(2),
    paddingHorizontal: WIDTH(4),
  },
  detailsContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // backgroundColor: COLOR.LightGray,
    borderRadius: 8,
    paddingHorizontal: WIDTH(3),
    marginVertical: HEIGHT(0.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WIDTH(2),
    marginVertical: HEIGHT(.5),
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
  imgs: {
    width: 330,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 9,
    marginBottom: HEIGHT(4),
  },
});
