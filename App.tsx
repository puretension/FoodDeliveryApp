import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
// import CodePush, {CodePushOptions} from 'react-native-code-push';
import {useEffect} from 'react';
//// import {Rootstate from '@neduxis/toolkit/query; 이거 아님!

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
PushNotification.configure({
  // (optional) 토큰이 생성될 때 실행됨(토큰을 서버에 등록할 때 쓸 수 있음)
  onRegister: function (token: any) {
    console.log('TOKEN:', token); // unique device token
  },

  // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
  onNotification: function (notification: any) {
    console.log('NOTIFICATION:', notification);
    if (notification.channelId === 'riders') {
      // if (notification.message || notification.data.message) {
      //   store.dispatch(
      //// push alarm을 누르면 일반적으로 앱이 켜지고, 그 알림은 사라진다.
      // 하지만 showPushPopup을 dispatch하면 알림이 사라지지 않고, 앱이 켜진 상태에서 팝업이 뜬다.(클릭하면? 그때 사라짐)
      // 또는 그 알림을 클릭했을때 특정 URL로 이동하게 할 수도 있다.(readme 참고
      //     userSlice.actions.showPushPopup(
      //       notification.message || notification.data.message,
      //     ),
      //   );
      // }
    }
    // process the notification

    // (required) 리모트 노티를 수신하거나, 열었거나 로컬 노티를 열었을 때 실행
    notification.finish(PushNotificationIOS.FetchResult.NoData); // iOS required
  },

  // (optional) 등록한 액션을 누렀고 invokeApp이 false 상태일 때 실행됨, true면 onNotification이 실행됨 (Android)
  onAction: function (notification: any) {
    console.log('ACTION:', notification.action);
    console.log('NOTIFICATION:', notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err: Error) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});
// 아래와 같은 채널들을 여러개 만들 수 있다.(Ex. 공지사항용, 포인트적립용, 채팅용, 등록용 등)
//
PushNotification.createChannel(
  {
    channelId: 'riders', // (required)
    channelName: '앱 전반', // (required)
    channelDescription: '앱 실행하는 알림', // (optional) default: undefined.
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: 4, // (optional) default: 4. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
  },
  (created: boolean) =>
    console.log(`createChannel riders returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
);

// const codePushOptions: CodePushOptions = {
//   checkFrequency: CodePush.CheckFrequency.MANUAL,
//   // 언제 업데이트를 체크하고 반영할지를 정한다.
//   // ON_APP_RESUME은 Background에서 Foreground로 오는 것을 의미
//   // ON_APP_START은 앱이 실행되는(켜지는) 순간을 의미
//
//   installMode: CodePush.InstallMode.IMMEDIATE,
//   mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
//   // 업데이트를 어떻게 설치할 것인지 (IMMEDIATE는 강제설치를 의미)
// };
function App() {
  // firebase 설정코드는 return문 바깥에 작성

  // Provider 바깥에서는 useSeLector 사용 불가
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </Provider>
  );
  // useEffect(() => {
  //   CodePush.sync(
  //     {
  //       installMode: CodePush.InstallMode.IMMEDIATE,
  //       mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
  //       updateDialog: {
  //         mandatoryUpdateMessage:
  //           '필수 업데이트가 있어 설치 후 앱을 재시작합니다.',
  //         mandatoryContinueButtonLabel: '재시작',
  //         optionalIgnoreButtonLabel: '나중에',
  //         optionalInstallButtonLabel: '재시작',
  //         optionalUpdateMessage: '업데이트가 있습니다. 설치하시겠습니까?',
  //         title: '업데이트 안내',
  //       },
  //     },
  //     status => {
  //       console.log(`Changed ${status}`);
  //     },
  //   ).then(status => {
  //     console.log(`CodePush ${status}`);
  //   });
  // }, []);

  // // firebase 설정코드는 return문 바깥에 작성
  //
  // // Provider 바깥에서는 useSeLector 사용 불가
  // return (
  //   <Provider store={store}>
  //     <NavigationContainer>
  //       <AppInner />
  //     </NavigationContainer>
  //   </Provider>
  // );
}

export default App;

// export default CodePush(codePushOptions)(App);
