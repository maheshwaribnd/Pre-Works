import {
  FlatList,
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import COLOR from '../../../../config/color.json';
import Swiper from 'react-native-swiper';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {useNavigation, useRoute} from '@react-navigation/native';
import ApiManager from '../../../../API/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import RNFetchBlob from 'react-native-blob-util';
import Snackbar from 'react-native-snackbar';
import FileViewer from 'react-native-file-viewer';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import HeaderWithEdit from '../../../../Component/CustomeHeader/HeaderWithEdit';

const ProjectAppliedDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const preId = route?.params?.PreId;

  const [edit, setEdit] = useState(false);
  const [userId, setUserId] = useState('');
  const [appliedDetails, setAppliedDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [preworkPdf, setPreworkPdf] = useState([]);
  const [contractorPdf, setContractorPdf] = useState([]);
  const [materialSelected, setMaterialSelected] = useState('');
  const [createData, setCreateData] = useState({
    price: '',
    time: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      ProjectAppliedDetailAPI();
    }
  }, [userId]);

  const ProjectAppliedDetailAPI = () => {
    ApiManager.ProjectAppliedDetails(preId, userId).then(res => {
      if (res?.data?.status === 200) {
        const appliedResponse = res?.data?.contractor;
        const imgResponse = res?.data?.preworkFiles;
        const prePdfResponse = res?.data?.preworkpdf;
        const contractorPdfResponse = res?.data?.contractorPdffiles;

        setCreateData(appliedResponse);
        setAppliedDetails(appliedResponse);
        setResImgs(imgResponse);
        setPreworkPdf(prePdfResponse);
        setContractorPdf(contractorPdfResponse);
      }
    });
  };

  const AppliedProjectEditAPI = () => {
    const formData = new FormData();

    formData.append('time', createData.time);
    formData.append('material', materialSelected);
    formData.append('price', createData.price);

    ApiManager.AppliedProjectEdit(preId, userId, formData)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.success,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          setEdit(false);
          navigation.navigate('contractorTabs');
        }
      })
      .catch(err => {
        console.log('API Error:', err.response?.data || err.message);
      });
  };

  const onChange = (key, value) => {
    setCreateData(prev => ({
      ...prev,
      [key]: value,
    }));
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
      Alert.alert('Error', 'An error occurred while previewing the PDF.');
    }
  };

  // Function to download PDF
  const downloadPDF = async (pdfUrl, fileName = 'downloaded.pdf') => {
    try {
      console.log('Download URL:', pdfUrl);
      if (!pdfUrl) {
        Alert.alert('Invalid URL', 'No valid PDF URL provided.');
        return;
      }

      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required.');
        return;
      }

      // Download Path
      const {dirs} = RNFetchBlob.fs;
      const downloadPath = `${dirs.DownloadDir}/${fileName}`;

      // Download PDF using Android Download Manager
      RNFetchBlob.config({
        fileCache: true,
        path: downloadPath,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mime: 'application/pdf',
          title: fileName,
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

  // Component to render PDF preview and download
  const RenderPrewordPDF = ({item}) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await previewPDF(item?.files, item?.file_name);
          downloadPDF(item?.files, item?.file_name); // Download after preview
        }}>
        <Image source={require('../../../../assets/Icons/pdf.png')} />
      </TouchableOpacity>
    );
  };

  const DownloadCPdfFunction = async (pdfUrl, fileName = 'downloaded.pdf') => {
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

  const RenderContractorPDF = ({item}) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await previewPDF(item?.files, item?.file_name);
          DownloadCPdfFunction(item?.files, item?.file_name);
        }}>
        <Image source={require('../../../../assets/Icons/pdf.png')} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Project Applied" edit={edit} setEdit={setEdit} />
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
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>{appliedDetails?.name}</Text>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <CalenderIcon />
                  <Text style={styles.detailText}>
                    Expected Start Date for Prwork:{' '}
                    {appliedDetails?.expected_date}
                  </Text>
                </View>
                <View style={styles.row}>
                  <CalenderIcon />
                  <Text style={styles.detailText}>
                    Last Date for Quote Submission: {appliedDetails?.last_date}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <LocationIcon />
                <Text style={styles.detailText}>{appliedDetails?.address}</Text>
              </View>
              <View style={styles.detailsWrapper}></View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                  {appliedDetails?.description}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>My Quotation Info</Text>

              {preworkPdf?.length > 0 ? (
                <View>
                  <Text style={styles.title}>Prework PDF Document</Text>
                  <FlatList
                    data={preworkPdf}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => <RenderPrewordPDF item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              ) : (
                <Text>No PDF available</Text>
              )}

              {contractorPdf?.length > 0 ? (
                <View>
                  <Text style={styles.title}>Contractor PDF Document</Text>
                  <FlatList
                    data={contractorPdf}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => <RenderContractorPDF item={item} />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              ) : (
                <Text>No PDF available</Text>
              )}

              {/* <TextInput
                style={styles.InputField}
                placeholder={String(createData?.price ?? '')}
                placeholderTextColor="gray"
                keyboardType="numeric"
                editable={edit}
                value={String(createData?.price ?? '')}
                onChangeText={text => onChange('price', text)}
              />

              <TextInput
                style={styles.InputField}
                value={createData?.time}
                placeholder={createData?.time}
                placeholderTextColor="gray"
                editable={edit}
                keyboardType="default"
                onChangeText={text => onChange('time', text)}
              /> */}

              {/* For Material Select */}
              {/* <View
                style={[
                  styles.InputField,
                  {alignItems: 'center', justifyContent: 'center'},
                ]}>
                <RNPickerSelect
                  onValueChange={value => setMaterialSelected(value)}
                  items={[
                    {label: 'Labour', value: 'Labour'},
                    {label: 'Labour + Material', value: 'Labour + Material'},
                  ]}
                  placeholder={{
                    label: appliedDetails?.material,
                    value: appliedDetails?.material,
                  }}
                  style={styles.picker}
                  disabled={!edit}
                  dropdownItemStyle={{color: 'black'}}
                />
              </View> */}

              {edit ? (
                <CustomButton
                  name="Update"
                  onPress={() => AppliedProjectEditAPI()}
                />
              ) : null}
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ProjectAppliedDetails;

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
  imageSlider: {
    height: 240,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgs: {
    width: 330,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 9,
    marginBottom: HEIGHT(3),
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
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: HEIGHT(1),
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
    margin: 10,
  },
  button: {
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

  InputField: {
    width: WIDTH(81),
    height: HEIGHT(7.5),
    marginVertical: HEIGHT(1.5),
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: COLOR.Gray,
    color: COLOR.black,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
