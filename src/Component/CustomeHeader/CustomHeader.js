import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import COLOR from '../../config/color.json';
import LinearGradient from 'react-native-linear-gradient';
import {FONTSIZE, HEIGHT, NotoSans_Regular} from '../../config/AppConst';

const CustomHeader = ({name}) => {
  return (
    <View>
      <LinearGradient
        colors={['#0AD788', '#1EA35A']}
        activeOpacity={0.4}
        style={styles.header}>
        {/* <Image
          source={require('../../assets/Icons/back.png')}
          height={10}
          width={10}
        /> */}

        <Text style={styles.name}>{name}</Text>
      </LinearGradient>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT(10),
  },

  name: {
    fontFamily: NotoSans_Regular,
    fontWeight: '500',
    fontSize: FONTSIZE(2.4),
    color: COLOR.White,
  },
});
