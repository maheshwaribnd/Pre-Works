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
import React from 'react';
import COLOR from '../../../config/color.json';
import {HEIGHT, WIDTH} from '../../../config/AppConst';
import AntDesign from 'react-native-vector-icons/AntDesign';
import CustomHeader from '../../../Component/CustomeHeader/CustomHeader';

const ArchitectList = () => {
  const renderList = () => {
    return (
      <TouchableOpacity style={styles.ListBox}>
        <View>
          <Image
            source={require('../../../assets/Icons/upload.png')}
            style={styles.img}
          />
        </View>
        <View>
          <Text style={styles.name}>name</Text>
          <Text style={styles.address}>address</Text>
        </View>

        <AntDesign name="caretright" />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Architect List" />
      <ImageBackground
        source={require('../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {/* <FlatList renderItem={item => <renderList item={item} />} /> */}

          <TouchableOpacity style={styles.ListBox}>
            <View>
              <Image
                source={require('../../../assets/Icons/upload.png')}
                style={styles.img}
              />
            </View>
            <View>
              <Text style={styles.name}>name</Text>
              <Text style={styles.address}>address</Text>
            </View>

            <AntDesign name="caretright" />
          </TouchableOpacity>
        </ScrollView>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: COLOR.White,
    borderColor: COLOR.LightGray,
    padding: WIDTH(2),
    borderRadius: 6,
    marginHorizontal: HEIGHT(1),
    marginVertical: HEIGHT(0.8),
    // height: HEIGHT(20)
  },

  img: {
    height: HEIGHT(11),
    width: WIDTH(21),
    borderRadius: 7,
  },
});
