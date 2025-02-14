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
import ApiManager from '../../../../API/Api';

const ClosedPrework = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    ClosedPreworkAPI();
  }, []);

  const ClosedPreworkAPI = () => {
    ApiManager.ClosedPrework().then(res => {
      if (res?.data?.status === 200) {
        const response = res?.data?.preworks;
        setData(response);
      }
    });
  };

  const ProjectCard = item => {
    const ParticularClosePrework = item => {
      navigation.navigate('closedpreworkdetails', {preworkId: item?.item?.id});
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => ParticularClosePrework(item)}>
        <Image source={{uri: item?.item?.upload_image}} style={styles.image} />
        {/* {item.isNew && (
            <View style={styles.newBid}>
              <Text style={styles.newBidText}>NEW BID</Text>
            </View>
          )} */}
        <View style={styles.cardContent}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>{item?.item?.name}</Text>
            <Text style={styles.text}>Add: {item?.item?.address}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Closed Pre-Works Requirement" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <View>
          <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({item}) => <ProjectCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ClosedPrework;

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
    marginLeft: 5,
  },
});
