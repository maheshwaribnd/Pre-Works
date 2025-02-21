import {
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../../../config/color.json';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../../../config/AppConst';
import AddWorkIcon from '../../../../assets/Svg/AddIcon.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiManager from '../../../../API/Api';
import CreateBtn from '../../../../assets/Svg/createBtn.svg';
import Arrow from '../../../../assets/Svg/Arrow.svg';
import Snackbar from 'react-native-snackbar';

const MyWork = () => {
  const navigation = useNavigation();
  const [archiId, setArchiId] = useState(null);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (archiId) {
      ArchitectWorkListAPI();
    }
  }, [archiId]);

  const getUser = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    setArchiId(UserID);
  };

  const ArchitectWorkListAPI = () => {
    ApiManager.ArchitectMyWorkList(archiId).then(res => {
      if (res?.data?.status === 200) {
        const response = res?.data?.data;
        console.log('response', response);

        setListData(response);
      } else {
        Snackbar.show({
          text: res?.data?.message,
          backgroundColor: '#27cc5d',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    });
  };

  const ProjectCard = item => {
    const openParticularWork = item => {
      const ID = item?.item?.id;
      navigation.navigate('myworkdetails', {Id: ID});
    };

    return (
      <TouchableOpacity
        style={styles.ListBox}
        onPress={() => openParticularWork(item)}>
        <View>
          <Image
            source={{uri: item?.item?.files}}
            style={{width: 100, height: 100, borderRadius: 6}}
          />
        </View>
        <View style={styles.listView}>
          <View>
            <Text style={styles.name}>{item?.item?.site_name}</Text>
            <Text style={styles.address}>{item?.item?.address}</Text>
          </View>
          <Arrow name="caretright" color="#03A151" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="My Work" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        {listData && listData.length > 0 ? (
          <View>
            <FlatList
              data={listData}
              keyExtractor={item => item.id}
              renderItem={({item}) => <ProjectCard item={item} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('createmywork')}
              style={styles.create}>
              <CreateBtn />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('createmywork')}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <AddWorkIcon />
          </TouchableOpacity>
        )}
      </ImageBackground>
    </View>
  );
};

export default MyWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },

  txt: {
    fontFamily: NotoSans_Medium,
    fontSize: 14,
    color: COLOR.Gray,
  },

  create: {
    position: 'absolute',
    bottom: 0,
    right: 9,
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
    width: WIDTH(95),
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
    height: 160,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  cardContent: {
    padding: 10,
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

  ListBox: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: COLOR.White,
    borderColor: COLOR.LightGray,
    borderRadius: 6,
    marginHorizontal: HEIGHT(1),
    marginVertical: HEIGHT(0.8),
    // height: HEIGHT(20)
  },

  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    padding: HEIGHT(2),
  },
});
