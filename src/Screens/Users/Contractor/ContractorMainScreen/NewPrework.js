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
import ManWithLaptop from '../../../../assets/Svg/ManWithLaptop.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import {useNavigation} from '@react-navigation/native';

const NewPrework = () => {
  const navigation = useNavigation();
  const [listResponse, setListResponse] = useState([]);
  useEffect(() => {
    NewPreworkListingAPI();
  }, []);

  const NewPreworkListingAPI = () => {
    ApiManager.NewPreworkList()
      .then(res => {
        if (res?.data?.status === 200) {
          const response = res?.data?.preworks;
          setListResponse(response);
        }
      })
      .catch(err => console.log(err));
  };

  const ProjectCard = item => {
    const openParticularPrework = item => {
      const PreID = item?.item?.id;
      navigation.navigate('newpreworkdetails', {preworkId: PreID});
    };

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => openParticularPrework(item)}>
        {listResponse[0]?.files?.length > 0 && (
          <Image
            source={{uri: listResponse[0].files[0].files}}
            style={styles.image}
          />
        )}

        {/* {item.isNew && (
            <View style={styles.newBid}>
              <Text style={styles.newBidText}>NEW BID</Text>
            </View>
          )} */}
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
});
