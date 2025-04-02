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
import Time from '../../../../assets/Svg/Time.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import Mobile from '../../../../assets/Svg/Mobile.svg';
import LinearGradient from 'react-native-linear-gradient';
import FileViewer from 'react-native-file-viewer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import RNFetchBlob from 'react-native-blob-util';

const OfferEnquiesDetails = () => {
  const route = useRoute();
  const contractorID = route?.params?.contractorID;

  const [cusId, setCusId] = useState('');
  const [contractorDetails, setContractorDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [resPdf, setResPdf] = useState([]);

  const [Accept, setAccept] = useState(false);
  const [Reject, setReject] = useState(false);

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
    ApiManager.EnquiryDetailsById(contractorID)
      .then(res => {
        if (res?.data?.status === 200) {
          const response = res?.data?.contractorDetail;
          const images = res?.data?.contractorImage;
          const contractorPdf = res?.data?.contractorPdffiles;

          setContractorDetails(response);
          setResImgs(images);
          setResPdf(contractorPdf);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const BidAcceptedAPI = () => {
    const params = {
      customer_id: cusId,
      prework_id: 1,
      contractor_id: contractorID,
    };
    ApiManager.BidAccepted(params)
      .then(res => {
        if (res?.data?.status === 200) {
          console.log('BA', res?.data);
          Snackbar.show({
            text: 'Bid Accepted',
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          setAccept(false);
        }
      })
      .catch(err => {
        console.log(err?.response);
      });
  };

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
    <View style={{flex: 1}}>
      <CustomHeader name="Offer Enquiries" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardWrapper}>
            <Image
              source={{uri: contractorDetails?.profile_image}}
              style={styles.profileImg}
              resizeMethod="resize"
            />

            <View style={styles.contentWrapper}>
              <Text style={styles.title}>
                {contractorDetails?.contractor_name}
              </Text>
              
                <View style={styles.row}>
                  <Mobile />
                  <Text style={styles.detailText}>
                    {contractorDetails?.contractor_mobile}
                  </Text>
                </View>
                {/* <View style={styles.row}>
                  <MaterialIcon />
                  <Text style={[styles.detailText, {width: WIDTH(20)}]}>
                    {contractorDetails?.contractor_material}
                  </Text>
                </View> */}
             
                <View style={styles.row}>
                  <Time />
                  <Text style={styles.detailText}>
                    {contractorDetails?.contractor_time} Months
                  </Text>
                </View>
                {/* <View style={styles.row}>
                  <Currency />
                  <Text style={styles.detailText}>
                    {contractorDetails?.contractor_price}
                  </Text>
                </View> */}
              
              <View style={styles.row}>
                <LocationIcon />
                <Text style={styles.detailText}>
                  {contractorDetails?.contractor_worklocation}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.detailText}>
                  {contractorDetails?.prework_description}
                </Text>
              </View>

              {resPdf?.length > 0 ? (
                <View>
                  <Text style={styles.sectionTitle}>PDF Document</Text>
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

              {/* <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <GradientButton
                  text="CONTRACTOR UPLOADED QUOTATION"
                  colors={['#029A49', '#0BDB8D']}
                  onPress={() => setAccept(true)}
                />
              </View> */}
              {/* {Reject ? (
                <BidModal
                  heading="Are you Sure, you want to cancel?"
                  showModal={Reject}
                  setShowModal={setReject}
                  name="REJECT"
                  color={['#F78941', '#D2390F']}
                  onPress={() => {
                    Snackbar.show({
                      text: 'Bid Rejected',
                      backgroundColor: '#D1264A',
                      duration: Snackbar.LENGTH_SHORT,
                    });
                    // setReject(!Reject)
                  }}
                />
              ) : null} */}

              {/* {Accept ? (
                <BidModal
                  heading="Are you Sure, do you want to go with this bid now?"
                  showModal={Accept}
                  setShowModal={setAccept}
                  name="ACCEPT"
                  color={['#0AD788', '#03A151']}
                  onPress={() => BidAcceptedAPI()}
                />
              ) : null} */}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default OfferEnquiesDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  profileImg: {
    height: HEIGHT(25),
    width: WIDTH(88),
    borderRadius: 6,
  },

  cardWrapper: {
    // backgroundColor: COLOR.White,
    // elevation: 5,
    borderRadius: 16,
    marginVertical: HEIGHT(3),
    marginHorizontal: HEIGHT(1),
    // overflow: 'hidden',
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
    paddingVertical: WIDTH(2),
  },
  title: {
    fontFamily: Montserrat_bold,
    fontSize: 22,
    color: COLOR.Black,
    textAlign: 'left',
    marginVertical: HEIGHT(1.5),
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
  buttonContainer: {
    position: 'absolute',
    top: 65,
  },

  button: {
    width: WIDTH(90),
    paddingVertical: 14,
    paddingHorizontal: 4,
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
});
