import {PermissionsAndroid, Platform} from 'react-native';

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      // Android 13+ (API 33 & 34)
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_DOCUMENTS,
      ]);

      return (
        result['android.permission.READ_MEDIA_IMAGES'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.READ_MEDIA_DOCUMENTS'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      // Android 10 - 12 (API 29 - 32)
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true; // Not Android, automatically allow
};

export default requestStoragePermission;
