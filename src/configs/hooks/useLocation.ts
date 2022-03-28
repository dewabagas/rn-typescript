import {useEffect, useState, useCallback} from 'react';
import {PermissionsAndroid, Alert, Linking, Platform} from 'react-native';
import Geolocation, {GeoPosition} from 'react-native-geolocation-service';

interface IUseLocationProps {
  force: boolean;
}

const initProps: IUseLocationProps = {
  force: false,
};

function useLocation(props = initProps) {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    const hasLocationPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version < 23) {
        return true;
      }

      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (hasPermission) {
        return true;
      }

      const status = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Peringatan',
          message: 'Izinkan POS GIRO CASH mengakses lokasi anda',
          buttonPositive: 'Izinkan',
          buttonNegative: 'Jangan',
        },
      );

      console.log('status', status);

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      if (status === PermissionsAndroid.RESULTS.DENIED) {
        hasLocationPermission();
      } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Peringatan',
          'POS GIRO CASH membutuhkan akses lokasi anda',
          [
            {
              text: 'Buka Pengaturan',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
      return false;
    };
    async function setLocationPermission() {
      let granted = await hasLocationPermission();
      if (!granted) {
        granted = await hasLocationPermission();
      }
      console.log('check if granted', granted);
      setPermissionGranted(granted);
    }
    setLocationPermission();
  }, []);

  const getCurrentLocation = useCallback((): Promise<GeoPosition> => {
    return new Promise((resolve, reject): void => {
      if (permissionGranted) {
        Geolocation.getCurrentPosition(
          position => {
            resolve(position);
          },
          error => {
            if (props.force) {
              getCurrentLocation();
            } else {
              reject(error);
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          },
        );
      }
    });
  }, [permissionGranted, props.force]);

  return {
    permissionGranted,
    getCurrentLocation,
  };
}

export default useLocation;
