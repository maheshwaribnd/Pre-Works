import {
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
import COLOR from '../../../../config/color.json';
import {
  HEIGHT,
  Montserrat_bold,
  Montserrat_Medium,
  NotoSans_Light,
  NotoSans_Medium,
  WIDTH,
} from '../../../../config/AppConst';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import CalenderIcon from '../../../../assets/Svg/Calander.svg';
import LocationIcon from '../../../../assets/Svg/Location.svg';
import MoneyIcon from '../../../../assets/Svg/Money.svg';
import BiddingIcon from '../../../../assets/Svg/Bidding.svg';
import MaterialIcon from '../../../../assets/Svg/Material.svg';
import {useNavigation, useRoute} from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import ApiManager from '../../../../API/Api';
import Swiper from 'react-native-swiper';
import CustomButton from '../../../../Component/CustomButton/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';
import RNFS from 'react-native-fs';

const PostBidScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const preId = route?.params?.preId;
  const customerId = route?.params?.customerId;
  const [details, setDetails] = useState([]);
  const [resImgs, setResImgs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [PdfFiles, setPdfFiles] = useState([]);
  const [documentpdf, setDocumentPdf] = useState([]);

  const [createData, setCreateData] = useState({
    time: '',
  });

  useEffect(() => {
    PreworkDetailAPI();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  const PreworkDetailAPI = () => {
    ApiManager.NewPreworkById(preId)
      .then(res => {
        if (res?.data?.status === 200) {
          const prework = res?.data?.prework;
          const preworkFiles = res?.data?.preworkfiles;
          setDetails(prework);
          setResImgs(preworkFiles);
        }
      })
      .catch(err => console.log(err));
  };

  const Validate = () => {
    if (documentpdf.length === 0) {
      Snackbar.show({
        text: 'Please upload at least one PDF file.',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }

    if (!createData.time.trim()) {
      Snackbar.show({
        text: 'Please enter time',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      return false;
    }

    return true;
  };

  const ApplyForBidAPI = () => {
    if (!Validate()) return;
    const formData = new FormData();

    formData.append('contractor_id', userId);
    formData.append('prework_id', preId);
    formData.append('customer_id', customerId);
    formData.append('time', createData.time);
    //for PDF's
    documentpdf.forEach((pdf, index) => {
      formData.append(`files[]`, {
        uri: pdf.uri,
        name: pdf.name,
        type: pdf.type,
      });
    });

    ApiManager.ApplyForBid(formData)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.navigate('contractorTabs');
        }
      })
      .catch(err => {
        console.log('API Error:', err.response?.data);
        Snackbar.show({
          text: err.response?.data?.message,
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      });
  };

  const onChange = (key, value) => {
    setCreateData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    requestStoragePermission();
  }, []);

  //download pdf function
  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        return (
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handleUploadPDF = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Allows only PDF selection
        allowMultiSelection: true, // Allows multiple PDFs
      });

      // const newDocs = response.map(doc => ({
      //   uri: doc.uri,
      //   name: doc.name,
      // }));

      const newDocs = await Promise.all(
        response.map(async doc => {
          const newPath = `${RNFS.CachesDirectoryPath}/${doc.name}`;
          await RNFS.copyFile(doc.uri, newPath);

          return {uri: `file://${newPath}`, name: doc.name};
        }),
      );

      setPdfFiles(prevFiles => [...new Set([...prevFiles, ...newDocs])]);
      setDocumentPdf(prevFiles => [...new Set([...prevFiles, ...response])]);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled document picker');
      } else {
        Alert.alert('Error', 'Something went wrong while selecting documents.');
      }
    }
  };

  // Function to remove a selected document
  const handleRemovePDF = index => {
    setPdfFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    // setDocumentPdf(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <View style={{flex: 1, backgroundColor: COLOR.White}}>
      <CustomHeader name="New Pre-Works Project" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
        style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentWrapper}>
            <Swiper
              autoplay
              loop
              showsPagination
              paginationStyle={{bottom: 0}}
              style={styles.imageSlider}>
              {resImgs?.map((item, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{uri: item?.files}} style={styles.image} />
                </View>
              ))}
            </Swiper>
            <View style={{paddingRight: WIDTH(7)}}>
              <Text style={styles.title}>{details?.name}</Text>
              <View style={styles.row}>
                <CalenderIcon />
                <Text style={styles.detailText}>
                  Expected Start Date for Prwork: {details?.expected_date}
                </Text>
              </View>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <CalenderIcon />
                  <Text style={styles.detailText}>
                    End Date for Quote Submission: {details?.last_date}
                  </Text>
                </View>
              </View>
              <View style={styles.row}>
                <MaterialIcon />
                <Text style={styles.detailText}>{details?.material}</Text>
              </View>
              <View style={styles.detailsWrapper}>
                <View style={styles.row}>
                  <LocationIcon />
                  <Text style={styles.detailText}>{details?.address}</Text>
                </View>
              </View>

              <Text style={styles.label}>Upload PDF</Text>
              <View style={styles.btnWrap}>
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUploadPDF}
                  activeOpacity={0.9}>
                  <View style={styles.uploadView}>
                    <Text style={styles.icon}>📄</Text>
                    <Text style={styles.uploadTxt}>Upload Blue Print</Text>
                  </View>
                </TouchableOpacity>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{marginRight: 20}}>
                  {PdfFiles.length > 0 &&
                    PdfFiles.map((doc, index) => {
                      return (
                        <View>
                          <Pdf
                            source={{uri: doc.uri}}
                            style={styles.pdfStyle}
                          />
                          <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => handleRemovePDF(index)}>
                            <Image
                              source={require('../../../../assets/Icons/cross.png')}
                              style={styles.closeIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </ScrollView>
              </View>

              <Text style={styles.label}>
                Duration to Complete Project (months){' '}
              </Text>
              <TextInput
                style={styles.InputField}
                placeholder="Duration to Complete Project (months) "
                placeholderTextColor="gray"
                keyboardType="number-pad"
                value={createData.time}
                onChangeText={text => onChange('time', text)}
              />
            </View>

            <CustomButton
              name="Upload Quotation"
              onPress={() => ApplyForBidAPI()}
            />
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default PostBidScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(1),
  },

  contentWrapper: {
    padding: WIDTH(2),
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
    marginBottom: HEIGHT(2),
  },
  detailsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: HEIGHT(1),
  },
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
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

  label: {
    fontFamily: NotoSans_Medium,
    paddingLeft: 2,
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'left',
    color: COLOR.Black,
    marginTop: HEIGHT(1),
    marginBottom: 3,
  },

  InputField: {
    width: WIDTH(91.5),
    height: HEIGHT(7.5),
    marginBottom: HEIGHT(1.5),
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

  closeButton: {
    position: 'absolute',
    top: 0,
    right: -1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    width: 15, // Adjust the size of the cross icon
    height: 15,
    tintColor: 'red', // Change color if needed
  },

  btnWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },

  uploadView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.Gray,
    color: COLOR.black,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  uploadButton: {
    alignItems: 'center',
    marginBottom: HEIGHT(1),
    backgroundColor: '#fff',
  },

  uploadTxt: {
    fontFamily: NotoSans_Light,
    fontSize: 11,
    color: COLOR.Gray9,
    width: WIDTH(25),
    textAlign: 'center',
  },

  documentContainer: {
    marginRight: 10,
    alignItems: 'center',
  },
  pdfStyle: {
    width: 100,
    height: 85,
    // padding: WIDTH(1),
  },
  documentName: {
    maxWidth: 100,
    textAlign: 'center',
  },
  pdf: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 5,
  },
});
