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
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import Arrow from '../../../../assets/Svg/Arrow.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import {useNavigation} from '@react-navigation/native';

const ArchitectList = () => {
  const navigation = useNavigation();
  const [list, setList] = useState([]);

  useEffect(() => {
    ArchitectListAPI();
  }, []);

  const ArchitectListAPI = () => {
    ApiManager.ArchitectList()
      .then(res => {
        if (res?.data?.status === 200) {
          const response = res?.data?.architectures;
          setList(response);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const RenderList = ({item}) => {
    const ParticularArchitect = item => {
      navigation.navigate('architectDetailscreen', {
        architectId: item?.item?.id,
      });
    };

    return (
      <TouchableOpacity
        style={styles.ListBox}
        onPress={() => ParticularArchitect(item)}>
        <View>
          <Image
            source={{uri: item?.item?.profile_image}}
            style={{width: 100, height: 100, borderRadius: 6}}
          />
        </View>
        <View style={styles.listView}>
          <View>
            <Text style={styles.name}>{item?.item?.name}</Text>
            <Text style={styles.address}>{item?.item?.address}</Text>
          </View>
          <Arrow name="caretright" color="#03A151" />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Architect List" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <FlatList
          data={list}
          renderItem={item => <RenderList item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
};

export default ArchitectList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(3),
    paddingVertical: HEIGHT(2),
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

  img: {
    height: HEIGHT(11),
    width: WIDTH(21),
    borderRadius: 7,
  },

  name: {
    fontSize: 18,
    color: '#464646',
    lineHeight: 21,
    textAlign: 'right',
    paddingBottom: HEIGHT(1.5),
  },

  address: {
    color: COLOR.Gray9,
    lineHeight: 19,
    fontSize: 14,
    width: WIDTH(35),
    textAlign: 'right',
  },
});
