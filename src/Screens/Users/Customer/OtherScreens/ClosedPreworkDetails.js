import {
  FlatList,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../../../config/color.json';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import ApiManager from '../../../../API/Api';
import {useRoute} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';

const ClosedPreworkDetails = () => {
  const route = useRoute();
  const PreworkId = route?.params?.preworkId;

  const [data, setData] = useState(null);
  const [resImgs, setResImgs] = useState([]);
  const [resPdf, setResPdf] = useState([]);

  useEffect(() => {
    ClosedPreWorkByIdAPI();
  }, []);

  const ClosedPreWorkByIdAPI = () => {
    ApiManager.ClosedPreworkById(PreworkId).then(res => {
      if (res?.data?.status === 200) {
        setData(res?.data?.prework);
        setResImgs(res?.data?.preworkfiles);
        setResPdf(res?.data?.preworkpdf);
      }
    });
  };

  const previewPDF = async (pdfUrl, fileName = 'preview.pdf') => {
    try {
      console.log('Preview URL:', pdfUrl);
      if (!pdfUrl) {
        Alert.alert('Invalid URL', 'No valid PDF URL provided.');
        return;
      }

      // Request permission (Android 12 and below)
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required.');
        return;
      }

      // Set path for the temporary PDF
      const {dirs} = RNFetchBlob.fs;
      const filePath = `${dirs.CacheDir}/${fileName}`;

      // Download the PDF temporarily
      const response = await RNFetchBlob.config({
        fileCache: true,
        path: filePath,
      }).fetch('GET', pdfUrl);

      // Preview the downloaded PDF
      console.log('PDF Path:', response.path());
      await FileViewer.open(response.path(), {showOpenWithDialog: true});
    } catch (error) {
      console.error('Preview Error:', error);
      Alert.alert('Error', 'An error occurred while previewing the PDF.');
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        // Check Android Version
        if (Platform.Version >= 33) {
          return true; // No permission needed for Android 13+
        }
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    }
    return true; // iOS does not need permission
  };

  // Download PDF Function
  const DownloadFunction = async (pdfUrl, fileName = 'downloaded.pdf') => {
    try {
      console.log('Download URL:', pdfUrl);
      if (!pdfUrl) {
        Alert.alert('Invalid URL', 'No valid PDF URL provided.');
        return;
      }

      // Request storage permission (Android 12 and below)
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to download files.',
        );
        return;
      }

      // Download Path
      const {dirs} = RNFetchBlob.fs;
      const downloadPath = `${dirs.DownloadDir}/${fileName}`;
      console.log('Download Path:', downloadPath);

      // Download Configuration
      RNFetchBlob.config({
        fileCache: true,
        path: downloadPath,
        addAndroidDownloads: {
          useDownloadManager: true, // Use Download Manager
          notification: true,
          mime: 'application/pdf',
          title: fileName,
          path: downloadPath,
          description: 'Downloading PDF...',
          mediaScannable: true,
        },
      })
        .fetch('GET', pdfUrl)
        .then(res => {
          Alert.alert('Download Complete', `File saved to: ${res.path()}`);
        })
        .catch(error => {
          Alert.alert('Download Failed', 'Error downloading the file.');
        });
    } catch (error) {
      console.error('Download Error:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const RenderPDF = ({item}) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await previewPDF(item?.files, item?.file_name);
          DownloadFunction(item?.files, item?.file_name);
        }}>
        <Image source={require('../../../../assets/Icons/pdf.png')} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <CustomHeader name="Closed Pre-Works Requirement" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardWrapper}>
            {resImgs?.length > 0 && (
              <Swiper
                key={resImgs.length} // Ensures remount on data change
                autoplay
                loop
                showsPagination
                style={styles.imageSlider}
                paginationStyle={{bottom: 10}} // Ensure pagination is visible
              >
                {resImgs.map((item, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{uri: item?.files}} style={styles.imgs} />
                  </View>
                ))}
              </Swiper>
            )}

            <View style={{marginLeft: WIDTH(4)}}>
              {resPdf?.length > 0 ? (
                <View>
                  <Text style={styles.title}>PDF Document</Text>
                  <FlatList
                    data={resPdf}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => <RenderPDF item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              ) : (
                <Text>No PDF available</Text>
              )}
            </View>
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>{data?.name}</Text>

              <View style={styles.row}>
                <CalenderIcon />
                <Text style={styles.detailText}>
                  Exp Prework Start Date:
                  {/* {data?.expected_date} */}
                </Text>
              </View>
              <View style={styles.row}>
                <CalenderIcon />
                <Text style={styles.detailText}>
                  Last Date for Quote Submission: {data?.last_date}
                </Text>
              </View>

              <View style={styles.row}>
                <MaterialIcon />
                <Text style={[styles.detailText, {width: WIDTH(32)}]}>
                  {data?.material}
                </Text>
              </View>

              <View style={styles.row}>
                <LocationIcon />
                <Text style={[styles.detailText, {width: WIDTH(32)}]}>
                  {data?.address}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{data?.description}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ClosedPreworkDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },
  cardWrapper: {
    backgroundColor: COLOR.White,
    borderRadius: 16,
    elevation: 5,
    margin: HEIGHT(3),
    // overflow: 'hidden',
  },
  imageSlider: {
    height: 240,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgs: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
    borderRadius: 9,
    marginBottom: HEIGHT(4),
  },
  contentWrapper: {
    padding: WIDTH(4),
  },
  title: {
    fontFamily: Montserrat_bold,
    fontSize: 22,
    color: COLOR.Black,
    textAlign: 'left',
    marginBottom: HEIGHT(2),
  },
  detailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: HEIGHT(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: WIDTH(2),
    marginBottom: HEIGHT(1),
  },
  detailText: {
    fontSize: 16,
    fontFamily: Montserrat_Medium,
    color: COLOR.Gray,
  },
  section: {
    marginVertical: HEIGHT(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Montserrat_bold,
    color: COLOR.Black,
    marginBottom: HEIGHT(1),
  },
  description: {
    fontSize: 14,
    fontFamily: Montserrat_Medium,
    color: COLOR.Gray,
    lineHeight: 22,
  },
});
