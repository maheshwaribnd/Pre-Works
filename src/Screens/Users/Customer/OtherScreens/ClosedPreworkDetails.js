import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
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
import {useNavigation, useRoute} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import DeleteIcon from '../../../../assets/Svg/delete.svg';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import PlotIcon from '../../../../assets/Svg/Plot.svg';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import BidModal from '../../../../Component/BidModal/BidModal';
import Snackbar from 'react-native-snackbar';import Pdf from 'react-native-pdf';
import {ActivityIndicator} from 'react-native-paper';

const ClosedPreworkDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const PreworkId = route?.params?.preworkId;

  const [data, setData] = useState(null);
  const [resImgs, setResImgs] = useState([]);
  const [resPdf, setResPdf] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfVisible, setisPdfVisible] = useState(false);
  const [pdfURL, setpdfURL] = useState('');

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

  const DeletePreworkAPI = () => {
    ApiManager.DeletePrework(PreworkId)
      .then(res => {
        if (res?.data?.status == 200) {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.navigate('customerTabs');
        }
      })
      .catch(err => {
        console.log('API Error:', err.response?.data || err.message);
        Snackbar.show({
          text: err.response?.data?.message || err.message,
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      });
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
      const filePath = `${dirs.DownloadDir}/${fileName}`;

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
      // Alert.alert('Error', 'An error occurred while previewing the PDF.');
    }
  };

  // Download PDF Function
  const DownloadFunction = async (pdfUrl, fileName = 'downloaded.pdf') => {
    try {
      console.log('Download URL:', pdfUrl);
      if (!pdfUrl) {
        Alert.alert('Invalid URL', 'No valid PDF URL provided.');
        return;
      }
      setIsLoading(true);
      // Request storage permission (Android 12 and below)
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert(
          'Permission Denied',
          'Storage permission is required to download files.',
        );
        setIsLoading(false);
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
          setpdfURL(res.data);
          setisPdfVisible(true);
          setIsLoading(false);
        })
        .catch(error => {
          setTimeout(() => {
            setpdfURL(downloadPath);
            setisPdfVisible(true);
            setIsLoading(false);
          }, 3000);
        });
    } catch (error) {
      console.error('Download Error:', error);
      setIsLoading(false);
    }
  };

  const RenderPDF = ({item}) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await DownloadFunction(item?.files, item?.file_name);
        }}>
        <Image source={require('../../../../assets/Icons/pdf.png')} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <CustomHeader name="Closed Prework Requirement" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardWrapper}>
          {isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
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
                  <Text style={styles.sectionTitle}>Architectural Drawing</Text>
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
                <MaterialIcon />
                <Text style={styles.detailText}>
                  Material: {data?.material}
                </Text>
              </View>

              <View style={styles.row}>
                <PlotIcon />
                <Text style={styles.detailText}>
                  Plot Size: {data?.site_area} (in sqft)
                </Text>
              </View>

              <View style={styles.row}>
                <CalenderIcon />
                <Text style={styles.detailText}>
                  Exp Prework Start Date: {data?.expected_date}
                </Text>
              </View>
              <View style={styles.row}>
                <CalenderIcon />
                <Text style={styles.detailText}>
                  End Date for Quote Submission: {data?.last_date}
                </Text>
              </View>

              <View style={styles.row}>
                <LocationIcon />
                <Text style={styles.detailText}>{data?.address}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>{data?.description}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
             <Text style={styles.sectionTitle}>Delete This Request</Text>
                <TouchableOpacity onPress={() => setShowModal(true)}>
                  <DeleteIcon />
                </TouchableOpacity>
              </View>

              {showModal ? (
                <BidModal
                  heading="Are you Sure, you want to Delete Prework?"
                  showModal={showModal}
                  setShowModal={setShowModal}
                  name="DELETE"
                  color={['#F78941', '#D2390F']}
                  onPress={() => DeletePreworkAPI()}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      <Modal
        transparent
        visible={isPdfVisible}
        animationType="fade"
        onRequestClose={() => setisPdfVisible(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View style={{flex: 1}}>
            <Pdf
              source={{
                uri: pdfURL,
                cache: true,
              }}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={{flex: 1}}
            />
          </View>
        </View>
      </Modal>
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
    paddingVertical: HEIGHT(3),
    paddingHorizontal: WIDTH(5),
  },
  title: {
    fontFamily: Montserrat_bold,
    fontSize: 22,
    color: COLOR.Black,
    textAlign: 'left',
    marginBottom: HEIGHT(1),
  },
  detailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: HEIGHT(1),
  },
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
    gap: WIDTH(2),
    marginBottom: HEIGHT(0.5),
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

  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
