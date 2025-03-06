import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import COLOR from '../../../../config/color.json';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../../../config/AppConst';
import ManWithLaptop from '../../../../assets/Svg/ManWithLaptop.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const NewPrework = () => {
  const navigation = useNavigation();
  const [listResponse, setListResponse] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log('listResponse', listResponse);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Check if the dashboard is the only screen in the stack
        if (navigation.canGoBack()) {
          return false; // Allow default back behavior
        }

        Alert.alert('Exit App', 'Do you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ]);

        return true; // Prevent going back
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // return () => {
      //   BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      // };
    }, [navigation]),
  );

  useEffect(() => {
    NewPreworkListingAPI();
  }, []);

  const NewPreworkListingAPI = () => {
    ApiManager.NewPreworkList()
      .then(res => {
        if (res?.data?.status === 200) {
          const response = res?.data?.preworks;
          setListResponse(response);
          setRefreshing(false);
        }
      })
      .catch(err => console.log(err));
  };

  const onRefresh = () => {
    NewPreworkListingAPI();
  };

  const getTag = prework => {
    let now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

    // Create Prework Date
    const createdAtStr = prework?.created_at;
    let isNew = false;
    if (createdAtStr) {
      const [cday, cmonth, cyear] = createdAtStr.split('/').map(Number);
      const createdAt = new Date(cyear, cmonth - 1, cday);
      createdAt.setHours(0, 0, 0, 0);
      isNew = createdAt.getTime() === now.getTime();
    }

    // End Prework Date
    const endDateStr = prework?.last_date;
    if (!endDateStr) return null; // Handle missing date case
    const [eday, emonth, eyear] = endDateStr.split('/').map(Number);
    const endDate = new Date(eyear, emonth - 1, eday);
    endDate.setHours(0, 0, 0, 0); // Reset time for accurate comparison

    // Check if Ending Soon
    const isEndingSoon =
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) <= 3;

    // Check if Expired
    const isExpired = endDate.getTime() < now.getTime();

    // **Prioritize 'APPLIED' first**
    if (prework?.status === 'bid') return {label: 'APPLIED', color: '#0ACE7A'};
    if (isNew) return {label: 'NEW', color: '#0484E4'};
    if (isExpired) return {label: 'EXPIRED', color: '#085CBB'}; // Expired should take priority
    if (isEndingSoon) return {label: 'ENDING SOON', color: '#DB2E18'};

    return null;
  };

  const ProjectCard = item => {
    const openParticularPrework = item => {
      const PreID = item?.item?.id;
      navigation.navigate('newpreworkdetails', {preworkId: PreID});
    };

    const tag = getTag(item?.item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openParticularPrework(item)}>
        {item?.item?.files?.length > 0 && (
          <Image
            source={{uri: encodeURI(item?.item?.files[0]?.files)}}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {tag && (
          <View style={[styles.tagBadge, {backgroundColor: tag.color}]}>
            <Text style={styles.tagText}>{tag.label}</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.title}>{item?.item?.name}</Text>
          <View style={styles.row}>
            {/* <LocationIcon /> */}
            <Text style={styles.text}>{item?.item?.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="New Pre-Work Project" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
          {listResponse ? (
            <View>
              <FlatList
                data={listResponse}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ProjectCard item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            </View>
          ) : (
            <View style={styles.empty}>
              <ManWithLaptop height={360} width={360} />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default NewPrework;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  card: {
    width: WIDTH(90),
    backgroundColor: '#fff',
    borderTopRightRadius: 26,
    borderTopLeftRadius: 26,
    marginBottom: HEIGHT(2.5),
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 0.5,
    borderColor: '#8ECEAB',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    fontFamily: NotoSans_Medium,
    color: '#333',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: COLOR.Gray9,
    // marginLeft: 5,
    textAlign: 'right',
    width: WIDTH(35),
  },
  newBid: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  newBidText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WIDTH(4),
  },

  tagBadge: {
    position: 'absolute',
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },

  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
