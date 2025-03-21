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
import COLOR from '../../../../config/color.json';
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import Arrow from '../../../../assets/Svg/Arrow.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import Experience from '../../../../assets/Svg/Experience.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import Currency from '../../../../assets/Svg/currency.svg';
import Mobile from '../../../../assets/Svg/Mobile.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OfferEnquires = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const PreworkId = route?.params?.PreworkId;
  const [cusId, setCusId] = useState('');
  const [contractorList, setContractorList] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setCusId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (cusId) {
      EnquiresListAPI();
    }
  }, [cusId]);

  const EnquiresListAPI = () => {
    ApiManager.ListOfEnquires(PreworkId)
      .then(res => {
        if (res?.data?.status === 200) {
          const response = res?.data?.enquiries;
          setContractorList(response);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const RenderList = ({item}) => {
    const ParticularContractor = item => {
      navigation.navigate('offerenquiesdetails', {
        contractorID: item?.item?.contractor_id,
      });
    };

    return (
      <TouchableOpacity
        style={styles.ListBox}
        onPress={() => ParticularContractor(item)}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
          {/* Profile Image */}
          <Image
            source={{uri: item?.item?.contractor_profile}}
            style={styles.img}
          />

          {/* Details */}
          <View style={{width: WIDTH(65)}}>
            <Text style={styles.name}>{item?.item?.contractor_name}</Text>
            <View style={styles.ViewAlign}>
              <View>
                <View style={styles.row}>
                  <Mobile />
                  <Text style={styles.infoText}>
                    {item?.item?.contractor_mobile}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Experience />
                  <Text style={styles.infoText}>
                    {item?.item?.contractor_experience} Year
                  </Text>
                </View>

                <View style={styles.row}>
                  <LocationIcon />
                  <Text style={[styles.infoText, {width: WIDTH(26)}]}>
                    {item?.item?.contractor_address}
                  </Text>
                </View>
              </View>
              <Arrow name="caretright" color="#03A151" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Offer Enquiries" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <FlatList
          data={contractorList}
          renderItem={item => <RenderList item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
};

export default OfferEnquires;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(1.5),
    paddingVertical: HEIGHT(2),
  },

  ListBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 10,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#464646',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ViewAlign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
