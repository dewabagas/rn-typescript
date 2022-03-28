import React, {memo, useState} from 'react';
import {Text, View, Image, Alert, ScrollView} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {StackActions} from '@react-navigation/native';
import moment from 'moment';

import colors from '../../configs/constants/colors';
import commonStyles from '../../configs/styles/commonStyles';
import {percentageHeight} from '../../configs/utils/screenSize';
import loginStyles from './styles/login_styles';

// import {userLogin, ILoginData} from '../../configs/actions/userActions';
import {AppDispatch, RootState} from '../../redux/store';
import {userInOfflineMode} from '../../redux/slices/userSlice';
import useLocation from '../../configs/hooks/useLocation';
import type {LoginProps} from './types/loginTypes';

import AppButton from '../../components/AppButton';
import CustomTextInput from '../../components/CustomTextInput';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import Spacer from '../../components/Spacer';


const isDevMode = __DEV__ && DeviceInfo.getBundleId() === 'com.jpsmobile';
const defaultUsername = isDevMode ? '339991002' : 'TEST1';
const defaultPassword = isDevMode ? '111' : '111';

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    login: (args: ILoginData) => dispatch(userLogin(args)),
    userInOffline: () => dispatch(userInOfflineMode()),
  };
};

const mapStateToProps = (state: RootState) => ({
  network: state.network,
  user: state.user,
  app: state.app,
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const Login: React.FC<ConnectedProps<typeof connector> & LoginProps> = ({
  userInOffline,
  network,
  user,
  login,
  navigation,
  app: {buildId, appVersion},
}) => {
  const [username, setUsername] = useState(defaultUsername);
  const [password, setPassword] = useState(defaultPassword);

  const {permissionGranted} = useLocation();

  // async function onSubmit() {
  //   const build_id = DeviceInfo.getVersion();
  //   if (permissionGranted) {
  //     if (network.isConnected) {
  //       try {
  //         await login({
  //           client_id: 'mobile_jps',
  //           pos_terminal_type: '6017',
  //           username,
  //           password,
  //           build_id: build_id,
  //           app_version: appVersion > 0 ? appVersion : '52',
  //           trx_type: 'LOG',
  //           trx_date_time: moment().format('YYYYMMDDHHmmss'),
  //           system_trace_audit: '10000001',
  //         }).unwrap();
  //         const reset = StackActions.replace('HomeScreen');
  //         navigation.dispatch(reset);
  //       } catch (error) {}
  //     } else {
  //       if (user.isOfflineAllowed) {
  //         userInOffline();
  //         navigation.replace('HomeScreen');
  //       } else {
  //         Alert.alert(
  //           'Maaf',
  //           'Mode offline tidak dapat dilakukan, silahkan login terlebih dahulu',
  //         );
  //       }
  //     }
  //   }
  // }

  return (
    <ScrollView contentContainerStyle={commonStyles.growContainer}>
      <View style={[commonStyles.container, commonStyles.justifyCenter]}>
        <FocusAwareStatusBar
          backgroundColor={colors.transparent}
          barStyle="dark-content"
        />
        <View
          style={[
            commonStyles.verticalDefaultPadding,
            commonStyles.horizontalDefaultPadding,
          ]}>
          <View style={[commonStyles.row, commonStyles.alignEnd]}>
            <View>
              <Text style={commonStyles.h6}>Selamat Datang,</Text>
              <Text style={commonStyles.bodyText1}>
                Silahkan masuk untuk melanjutkan
              </Text>
            </View>
            <View style={loginStyles.logoContainer}>
              <Image
                source={require('../../assets/images/illustration/loginilustrasi.png')}
                style={loginStyles.imageStyle}
              />
            </View>
          </View>
          <Spacer style={{height: percentageHeight(5)}} />

          <Text style={commonStyles.formLabel}>Username</Text>
          <Spacer style={{height: percentageHeight(1)}} />
          <CustomTextInput
            onChangeText={setUsername}
            placeholder="Masukkan Username anda"
          />
          <Spacer style={{height: percentageHeight(2)}} />

          <Text style={commonStyles.formLabel}>Password</Text>
          <Spacer style={{height: percentageHeight(1)}} />
          <CustomTextInput
            onChangeText={setPassword}
            placeholder="Masukkan Password anda"
            secureTextEntry
          />

          <Spacer style={{height: percentageHeight(2.5)}} />
          <AppButton disabled={false} >
            Login
          </AppButton>

          <Spacer style={{height: percentageHeight(12)}} />
          <Text
            style={
              commonStyles.textAlignCenter
            }>{`${buildId}.${appVersion}`}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default connector(memo(Login));
