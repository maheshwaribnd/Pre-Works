import {
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
import {useNavigation, useRoute} from '@react-navigation/native';
import COLOR from '../../../../config/color.json';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import ApiManager from '../../../../API/Api';
import Swiper from 'react-native-swiper';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import PlotIcon from '../../../../assets/Svg/Plot.svg';
import RNFetchBlob from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import LinearGradient from 'react-native-linear-gradient';
import Pdf from 'react-native-pdf';
import {ActivityIndicator} from 'react-native-paper';

const NewPreworkDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const preId = route?.params?.preworkId;
  const isexpired = route?.params?.expired;
  const [details, setDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [resPdf, setResPdf] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfVisible, setisPdfVisible] = useState(false);
  const [pdfURL, setpdfURL] = useState('');

  useEffect(() => {
    PreworkDetailAPI();
  }, []);

  const PreworkDetailAPI = () => {
    ApiManager.NewPreworkById(preId)
      .then(res => {
        if (res?.data?.status === 200) {
          const prework = res?.data?.prework;
          const preworkFiles = res?.data?.preworkfiles;
          setResPdf(res?.data?.preworkpdf);
          setDetails(prework);
          setResImgs(preworkFiles);
        }
      })
      .catch(err => console.log(err));
  };

  // const BidFunction = () => {
  //   if (isexpired) {
  //     setBid(false);
  //     Snackbar.show({
  //       text: 'This Prework is Expired!',
  //       backgroundColor: '#D1264A',
  //       duration: Snackbar.LENGTH_SHORT,
  //     });
  //   } else {
  //     setBid(true);
  //   }
  // };

  const GradientButton = ({text, colors, onPress}) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
        <LinearGradient
          activeOpacity={0.4}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          colors={colors}
          style={styles.button}>
          <Text style={styles.buttonText}>{text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          return true; // Android 13+ does not require storage permission
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
    return true; // No permission required on iOS
  };

  // Function to preview PDF
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
      // Alert.alert('Error', 'An error occurred while previewing the PDF.');
    }
  };

  // Function to download PDF
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
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={async () => {
            
            DownloadFunction(item?.files, item?.file_name);
          }}>
          <Image source={require('../../../../assets/Icons/pdf.png')} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="New Project" />
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
                paginationStyle={{bottom: 5}} // Ensure pagination is visible
              >
                {resImgs.map((item, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{uri: item?.files}} style={styles.imgs} />
                  </View>
                ))}
              </Swiper>
            )}

            <View
              style={{
                paddingHorizontal: WIDTH(4),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
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
              <Text style={styles.title}>{details?.name}</Text>

              <View style={styles.row}>
                <MaterialIcon />
                <Text style={styles.detailText}>
                  Material: {details?.material}
                </Text>
              </View>

              <View style={styles.row}>
                <PlotIcon />
                <Text style={styles.detailText}>
                  Plot Size: {details?.site_area} (in sqft)
                </Text>
              </View>

              <View style={styles.row}>
                <CalenderIcon />
                <Text style={styles.detailText}>
                  Exp Start Date for Prework:
                  {details?.expected_date}
                </Text>
              </View>

              <View style={styles.row}>
                <CalenderIcon />
                <Text style={styles.detailText}>
                  End Date for Quote Submission: {details?.last_date}
                </Text>
              </View>

              <View style={styles.row}>
                <LocationIcon />
                <Text style={styles.detailText}>{details?.address}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.detailText}>{details?.description}</Text>
              </View>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <GradientButton
                  text="SEND YOUR QUOTATION"
                  colors={['#029A49', '#0BDB8D']}
                  onPress={() =>
                    navigation.navigate('postbidscreen', {
                      preId: preId,
                      customerId: details?.customer_id,
                    })
                  }
                />
              </View>
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

export default NewPreworkDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  cardWrapper: {
    backgroundColor: COLOR.White,
    borderRadius: 16,
    elevation: 5,
    marginVertical: HEIGHT(3),
    marginHorizontal: HEIGHT(1),

    overflow: 'hidden',
  },

  imgs: {
    width: '100%',
    height: 210,
    resizeMode: 'cover',
    borderRadius: 9,
    marginBottom: HEIGHT(4),
  },

  imageSlider: {
    height: 240,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 9,
  },
  contentWrapper: {
    padding: WIDTH(4),
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
    marginVertical: HEIGHT(0.5),
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
  buttonContainer: {
    margin: 10,
  },
  button: {
    width: WIDTH(80),
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: NotoSans_Medium,
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
