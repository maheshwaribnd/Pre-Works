import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import COLOR from '../../config/color.json';
import LinearGradient from 'react-native-linear-gradient';
import EditIcon from '../../assets/Svg/edit.svg';
import {FONTSIZE, HEIGHT, NotoSans_Regular} from '../../config/AppConst';

const HeaderWithEdit = ({name, edit, setEdit}) => {
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
        <TouchableOpacity
          onPress={() => {
            setEdit(!edit);
          }}
          style={styles.edit}>
          <EditIcon color={COLOR.White} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default HeaderWithEdit;

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

  edit: {
    position: 'absolute',
    right: 6,
  },
});
