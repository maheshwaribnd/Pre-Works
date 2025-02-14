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
import {ActivityIndicator} from 'react-native-paper';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';

const OpenPrework = () => {
  const navigation = useNavigation();
  const [preworkList, setPreworkList] = useState([]);
  const [preworkImgs, setPreworkImgs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [cusId, setCusId] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (cusId) {
      PreworkListAPI();
    }
  }, [cusId]);

  const getUser = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    setCusId(UserID);
    console.log('UserID', UserID);
  };

  const PreworkListAPI = async () => {
    // setLoader(true)
    if (!cusId) return;
    await ApiManager.ListOfPrework(cusId)
      .then(res => {
        if (res?.data?.status === 200) {
          const response = res?.data?.preworks;

          const imgsResponse = res?.data?.preworkFiles;
          console.log('responseoOPL', response);
          console.log('imgsResponse', imgsResponse);

          setPreworkList(response || []);
          setPreworkImgs(imgsResponse);
        } else {
          setPreworkList([]);
        }
      })
      .catch(err => console.log('err', err));
  };

  const ProjectCard = item => {
    const openParticularPrework = item => {
      const PreID = item?.item?.id;
      navigation.navigate('openpreworkdeatils', {preworkId: PreID});
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openParticularPrework(item)}>
        <Image source={{uri: preworkImgs[0]?.files}} style={styles.image} />
        {/* {item.isNew && (
          <View style={styles.newBid}>
            <Text style={styles.newBidText}>NEW BID</Text>
          </View>
        )} */}
        <View style={styles.cardContent}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.title}>{item?.item?.name}</Text>
            <View style={styles.row}>
              <CalenderIcon />
              <Text style={styles.text}>{item?.item?.last_date}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <LocationIcon />
              <Text style={styles.text}>{item?.item?.address}</Text>
            </View>

            <View style={styles.row}>
              <MoneyIcon />
              <Text style={styles.text}>{item?.item?.custombid}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <BiddingIcon />
              <Text style={styles.text}>{item?.item?.budget_range}</Text>
            </View>

            <View style={styles.row}>
              <MaterialIcon />
              <Text style={styles.text}>{item?.item?.material}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Open Pre-Works Requirement" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        {preworkList && preworkList.length > 0 ? (
          <View>
            <FlatList
              data={preworkList}
              keyExtractor={item => item.id}
              renderItem={({item}) => <ProjectCard item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('createprework')}
              style={styles.create}>
              <CreateBtn />
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: WIDTH(2),
    paddingTop: WIDTH(3),
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
    width: WIDTH(90),
    backgroundColor: '#fff',
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    marginBottom: HEIGHT(2.5),
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
    height: 130,
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
    // marginBottom: 5,
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
