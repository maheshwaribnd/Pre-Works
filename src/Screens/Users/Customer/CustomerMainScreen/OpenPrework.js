import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../../../config/AppConst';
import COLOR from '../../../../config/color.json';
import NoData from '../../../../assets/Svg/noData.svg';
import {useNavigation} from '@react-navigation/native';
import CreateBtn from '../../../../assets/Svg/createBtn.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from '../../../../API/Api';

const OpenPrework = () => {
  const navigation = useNavigation();
  const [preworkList, setPreworkList] = useState([]);
  console.log('preworkList', preworkList);

  useEffect(() => {
    PreworkListAPI();
    getUser();
  }, []);

  const getUser = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    console.log('UserID', UserID);
  };

  const PreworkListAPI = () => {
    ApiManager.ListOfPrework()
      .then(res => {
        if (res?.data?.status == 200) {
          const response = res?.data?.preworks;
          setPreworkList(response);
        }
      })
      .catch(err => console.log('err', err));
  };

  const ProjectCard = item => {
    console.log('item', item?.item);

    return (
      <View style={styles.card}>
        <Image source={{uri: item?.item?.upload_image}} style={styles.image} />
        {/* {item.isNew && (
          <View style={styles.newBid}>
            <Text style={styles.newBidText}>NEW BID</Text>
          </View>
        )} */}
        <View style={styles.cardContent}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>{item?.item?.name}</Text>
            <View style={styles.row}>
              {/* <Icon name="place" size={16} color="green" /> */}
              <Text style={styles.text}>{item?.item?.timeperiod}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              {/* <Icon name="calendar-today" size={16} color="green" /> */}
              <Text style={styles.text}>{item?.item?.address}</Text>
            </View>

            <View style={styles.row}>
              {/* <Icon name="calendar-today" size={16} color="green" /> */}
              <Text style={styles.text}>{item?.item?.bidprice}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              {/* <Icon name="construction" size={16} color="green" /> */}
              <Text style={styles.text}>{item?.item?.bidRange}</Text>
            </View>

            <View style={styles.row}>
              {/* <Icon name="construction" size={16} color="green" /> */}
              <Text style={styles.text}>{item?.item?.material}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Open Pre-Works Requirement" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        {preworkList ? (
          <FlatList
            data={preworkList}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ProjectCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={styles.empty}>
            <NoData height={360} width={360} />
            <Text style={styles.txt}>
              You currently do not have any Open Pre-Work requirement to create
              a Pre-Work requirement, kindly select the + button shown in the
              bottom
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('createprework')}
              style={styles.create}>
              <CreateBtn />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default OpenPrework;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
    paddingTop: WIDTH(4),
  },

  txt: {
    fontFamily: NotoSans_Medium,
    fontSize: 14,
    color: COLOR.Gray,
  },

  create: {
    position: 'absolute',
    bottom: 6,
    right: 10,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: WIDTH(4),
  },

  list: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  card: {
    width: WIDTH(88),
    backgroundColor: '#fff',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginBottom: HEIGHT(3),
    overflow: 'hidden',
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
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    fontFamily: NotoSans_Medium,
    color: '#333',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: COLOR.Gray9,
    marginLeft: 5,
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
});
