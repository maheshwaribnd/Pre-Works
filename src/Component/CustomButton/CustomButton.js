import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import COLOR from '../../config/color.json';
import LinearGradient from 'react-native-linear-gradient';

const CustomButton = ({name, onPress}) => {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => onPress()}>
        <LinearGradient
          colors={['#0AD788', '#03A151']}
          activeOpacity={0.4}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.button}>
          <Text style={styles.txtBtn}>{name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(56),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
    marginTop: HEIGHT(3),
  },

  txtBtn: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2.4),
    color: COLOR.White,
  },
});
