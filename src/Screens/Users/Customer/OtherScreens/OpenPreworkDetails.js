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
import DeleteIcon from '../../../../assets/Svg/delete.svg';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import COLOR from '../../../../config/color.json';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  WIDTH,
  windowWidth,
} from '../../../../config/AppConst';
import ApiManager from '../../../../API/Api';
import {useNavigation, useRoute} from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import PlotIcon from '../../../../assets/Svg/Plot.svg';
import {ActivityIndicator} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'react-native-blob-util';
import Snackbar from 'react-native-snackbar';
import FileViewer from 'react-native-file-viewer';
import BidModal from '../../../../Component/BidModal/BidModal';
import Pdf from 'react-native-pdf';

const OpenPreworkDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const PreworkId = route?.params?.preworkId;

  const [data, setData] = useState([]);
  const [cusId, setCusId] = useState('');
  const [resImgs, setResImgs] = useState([]);
  const [resPdf, setResPdf] = useState([]);
  const [loader, setLoader] = useState(false);
  const [contractorList, setContractorList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfVisible, setisPdfVisible] = useState(false);
  const [pdfURL, setpdfURL] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setCusId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    PreWorkByIdAPI();
    if (cusId) {
      EnquiresListAPI();
    }
  }, [cusId]);

  const PreWorkByIdAPI = async () => {
    try {
      setLoader(true);
      const res = await ApiManager.OpenPreworkById(PreworkId);
      if (res?.data?.status === 200) {
        setData(res?.data?.prework || []);
        setResImgs(res?.data?.preworkfiles || []);
        setResPdf(res?.data?.preworkpdf);
        setLoader(false);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setLoader(false);
    }
  };

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

  const ContractorList = ({item}) => {
    return (
      <TouchableOpacity>
        <Image source={{uri: item?.contractor_profile}} style={styles.image} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <CustomHeader name="Active Request" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          {loader ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator />
            </View>
          ) : (
            <View style={styles.contentWrapper}>
              {/* Swiper for Images */}
              <Swiper
                autoplay
                loop
                showsPagination
                style={{height: 240}} // Make sure it has height
                paginationStyle={{bottom: 0}}>
                {resImgs?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={{uri: item?.files}} style={styles.imgs} />
                  </View>
                ))}
              </Swiper>

              <View
                style={{
                  paddingLeft: WIDTH(4),
                }}>
                {resPdf?.length > 0 ? (
                  <View>
                    <Text style={styles.sectionTitle}>
                      Architectural Drawing
                    </Text>
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

              {/* Title */}
              <Text style={styles.nametitle}>{data?.name}</Text>

              {/* Details Section */}
              <View style={{paddingLeft: WIDTH(4)}}>
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
                  <Text style={[styles.detailText, {width: WIDTH(85)}]}>
                    End Date for Quote Submission: {data?.last_date}
                  </Text>
                </View>

                <View style={[styles.row, {marginVertical: HEIGHT(0)}]}>
                  <LocationIcon />
                  <Text style={[styles.detailText, {width: WIDTH(85)}]}>
                    {data?.address}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.detailText}>{data?.description}</Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: WIDTH(4),
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

              {contractorList.length > 0 ? (
                <View style={[styles.section, {marginTop: HEIGHT(0)}]}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      {fontFamily: Montserrat_bold},
                    ]}>
                    Offer Enquiries
                  </Text>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                      flexGrow: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    {contractorList.map((item, index) => (
                      <ContractorList key={index} item={item} />
                    ))}
                  </ScrollView>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('offerenquires', {
                        PreworkId: PreworkId,
                      })
                    }
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.linkText}>
                      Click here to see enquiries
                    </Text>
                    <Image
                      source={require('../../../../assets/Icons/arrow.png')}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
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

export default OpenPreworkDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
  },

  contentWrapper: {
    padding: WIDTH(2),
  },

  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: windowWidth * 0.9,
    height: HEIGHT(30),
    resizeMode: 'cover',
    borderRadius: 10,
  },

  noImageText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLOR.Gray,
    marginVertical: HEIGHT(5),
  },
  nametitle: {
    fontFamily: Montserrat_bold,
    fontSize: 22,
    textAlign: 'left',
    color: COLOR.Black,
    marginTop: HEIGHT(1),
    marginLeft: WIDTH(4.2),
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: COLOR.LightGray,
    borderRadius: 8,
    paddingHorizontal: WIDTH(4),
    // marginVertical: HEIGHT(0.5),
  },
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
    gap: WIDTH(2),
    marginVertical: HEIGHT(0.5),
  },
  detailText: {
    fontSize: 16,
    fontFamily: Montserrat_Medium,
    color: COLOR.Gray,
  },
  section: {
    marginTop: HEIGHT(2),
    marginHorizontal: WIDTH(5),
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

  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250, // Adjust height as needed
    resizeMode: 'cover', // Ensure images are displayed properly
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
  },
  imgs: {
    width: 330,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 9,
    marginBottom: HEIGHT(4),
  },

  linkText: {
    fontSize: 16,
    fontFamily: Montserrat_bold,
    color: COLOR.PrimaryDarkColor,
    lineHeight: 22,
    textAlign: 'center',
    marginRight: 7,
  },

  arrow: {
    color: COLOR.PrimaryDarkColor,
    fontSize: 24,
    marginLeft: 5,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginLeft: -20,
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
