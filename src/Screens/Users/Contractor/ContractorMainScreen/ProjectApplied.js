import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import COLOR from '../../../../config/color.json';
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import Arrow from '../../../../assets/Svg/Arrow.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const ProjectApplied = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [projectAplliedList, setProjectAplliedList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Check if the dashboard is the only screen in the stack
        if (navigation.canGoBack()) {
          return false; // Allow default back behavior
        }

        Alert.alert('Exit App', 'Do you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ]);

        return true; // Prevent going back
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // return () => {
      //   BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      // };
    }, [navigation]),
  );

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      ProjectAppliedListAPI();
    }
  }, [userId]);

  const ProjectAppliedListAPI = () => {
    ApiManager.ProjectAppliedList(userId).then(res => {
      if (res?.data?.status === 200) {
        const response = res?.data?.preworks;
        setProjectAplliedList(response);
        setRefreshing(false);
      }
    });
  };

  const onRefresh = () => {
    ProjectAppliedListAPI();
  };

  const RenderList = ({item}) => {
    const ParticularProject = item => {
      navigation.navigate('projectapplieddetails', {
        PreId: item?.item?.id,
      });
    };

    return (
      <TouchableOpacity
        style={styles.ListBox}
        onPress={() => ParticularProject(item)}>
        <View style={styles.listView}>
          <Image
            source={{uri: item?.item?.files[0]?.files}}
            style={{width: 100, height: 100, borderRadius: 6}}
          />
          <View>
            <Text style={styles.name}>{item?.item?.name}</Text>
            <Text style={styles.address}>{item?.item?.address}</Text>
          </View>
        </View>
        <Arrow name="caretright" color="#03A151" />
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Project Applied" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <FlatList
          data={projectAplliedList}
          renderItem={item => <RenderList item={item} />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </ImageBackground>
    </View>
  );
};

export default ProjectApplied;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
    paddingVertical: HEIGHT(1),
  },

  ListBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    elevation: 5,
    backgroundColor: COLOR.White,
    borderColor: COLOR.LightGray,
    borderRadius: 6,
    marginHorizontal: HEIGHT(0.5),
    marginVertical: HEIGHT(1),
  },

  listView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 9,
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
    paddingBottom: HEIGHT(1),
  },

  address: {
    color: COLOR.Gray9,
    lineHeight: 19,
    fontSize: 14,
    width: WIDTH(35),
  },
});
