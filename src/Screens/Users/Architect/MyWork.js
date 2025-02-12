import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import COLOR from '../../../config/color.json';
import {HEIGHT, WIDTH} from '../../../config/AppConst';
import CustomHeader from '../../../Component/CustomeHeader/CustomHeader';

const MyWork = () => {
  return (
    <View style={{flex: 1}}>
      <CustomHeader name="My Work" />
      <ImageBackground
        source={require('../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
            <Text>Mywork</Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default MyWork;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },
});
