import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {NotoSans_Medium, WIDTH} from '../../../../config/AppConst';
import COLOR from '../../../../config/color.json';
import NoData from '../../../../assets/Svg/noData.svg';
import {useNavigation} from '@react-navigation/native';
import CreateBtn from '../../../../assets/Svg/createBtn.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';

const ClosedPrework = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Closed Pre-Works Requirement" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}></ImageBackground>
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
    paddingHorizontal: WIDTH(4),
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
});
