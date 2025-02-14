import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import ApiManager from '../../../../API/Api';
import COLOR from '../../../../config/color.json';
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import Arrow from '../../../../assets/Svg/Arrow.svg';
import Instagram from '../../../../assets/Svg/insta.svg';
import WhatsApp from '../../../../assets/Svg/whatsapp.svg';
import Gmail from '../../../../assets/Svg/gmail.svg';
import Call from '../../../../assets/Svg/call.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';

const ArchitectDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const architectId = route?.params?.architectId;

  const [architectData, setArchitectData] = useState({});
  const [architectWorkList, setArchitectWorkList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    ArchitectByIdAPI();
  }, []);

  const ArchitectByIdAPI = () => {
    setLoader(true);
    ApiManager.ArchitectById(architectId)
      .then(res => {
        if (res?.data?.status === 200) {
          setLoader(false);
          setArchitectData(res?.data?.architectureDetails);
          setArchitectWorkList(res?.data?.preworks);
        }
      })
      .catch(err => console.log(err));
  };

  const RenderWorkList = item => {
    const PastPreworkFunction = () => {
      navigation.navigate('architectpastpreworkdetails', {
        item: item?.item,
        loader: loader,
      });
    };

    return (
      <TouchableOpacity
        onPress={() => {
          PastPreworkFunction();
        }}>
        <View style={styles.workCard}>
          <Image source={{uri: item?.item?.image}} style={styles.workImage} />
          <View style={styles.workInfo}>
            <Text style={styles.workTitle}>{item?.item?.name}</Text>
            <Text style={styles.workDescription}>
              {item?.item?.description}
            </Text>
            <Text style={styles.workAddress}> {item?.item?.address}</Text>
          </View>
          <Arrow name="caretright" color="#03A151" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader name="Architect Details" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.backgroundImage}>
        {/* Architect Profile */}
        <View style={styles.profileContainer}>
          <Image
            source={{uri: architectData?.profile_image}}
            style={styles.bgImage}
          />
          <View style={styles.profileWrapper}>
            <Image
              source={{uri: architectData?.profile_image}}
              style={styles.profilePic}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{architectData?.name}</Text>
              <Text style={styles.description}>
                {architectData?.description}
              </Text>
              <Text style={styles.address}>{architectData?.address}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Call color={COLOR.Primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <WhatsApp color={COLOR.Primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Instagram color={COLOR.Primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Gmail color={COLOR.Primary} />
          </TouchableOpacity>
        </View>

        {/* Past Work Section */}
        <Text style={styles.pastWorkTitle}>Past Work</Text>
        <FlatList
          data={architectWorkList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => <RenderWorkList item={item} />}
        />
      </ImageBackground>
    </View>
  );
};

export default ArchitectDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  backgroundImage: {
    flex: 1,
  },
  profileContainer: {
    alignItems: 'center',
  },
  bgImage: {
    width: '100%',
    height: HEIGHT(25),
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -HEIGHT(7),
    paddingHorizontal: WIDTH(5),
  },
  profilePic: {
    width: WIDTH(25),
    height: WIDTH(25),
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLOR.White,
  },
  profileInfo: {
    marginLeft: WIDTH(6),
    marginTop: HEIGHT(7),
  },

  name: {
    fontSize: WIDTH(5),
    fontWeight: 'bold',
    color: COLOR.Black,
  },
  description: {
    // fontSize: WIDTH(3.5),
    color: COLOR.Gray,
  },
  address: {
    fontSize: WIDTH(3.5),
    color: COLOR.DarkGray,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: WIDTH(7),
    marginTop: HEIGHT(2),
  },
  actionButton: {
    backgroundColor: COLOR.White,
    padding: WIDTH(4),
    borderRadius: 50,
    marginHorizontal: WIDTH(2),
    elevation: 3,
  },
  pastWorkTitle: {
    fontSize: WIDTH(4),
    fontWeight: 'bold',
    marginVertical: HEIGHT(2),
    marginLeft: WIDTH(5),
    color: COLOR.PrimaryLightColor,
  },
  workCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLOR.White,
    borderRadius: WIDTH(3),
    padding: WIDTH(2),
    marginVertical: HEIGHT(1),
    marginHorizontal: WIDTH(5),
    elevation: 3,
    alignItems: 'center',
  },
  workImage: {
    width: WIDTH(30),
    height: WIDTH(25),
    borderRadius: WIDTH(2),
  },
  workInfo: {
    flex: 1,
    marginLeft: WIDTH(3),
  },
  workTitle: {
    fontSize: WIDTH(4),
    fontWeight: 'bold',
    color: COLOR.Black,
  },
  workDescription: {
    fontSize: WIDTH(3.5),
    color: COLOR.Gray,
  },
  workAddress: {
    fontSize: WIDTH(3.5),
    color: COLOR.DarkGray,
  },
  arrowIcon: {
    marginLeft: WIDTH(2),
  },
});
