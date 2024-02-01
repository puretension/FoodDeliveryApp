import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import Settings from './src/pages/Settings';
import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import useSocket from './src/hooks/useSocket';
import {useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios, {AxiosError} from 'axios';
import {Alert} from 'react-native';
import userSlice from './src/slices/user';
import {useAppDispatch} from './src/store';
import Config from 'react-native-config';
import orderSlice from './src/slices/order';
import usePermissions from './src/hooks/usePermissions.ts';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppInner() {
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => !!state.user.accessToken,
  );
  console.log('isLoggedIn', isLoggedIn);

  const [socket, disconnect] = useSocket();

  usePermissions();

  useEffect(() => {
    //request.use()는 에러났을때와 성공했을때를 나눠서 처리할 수 있음!
    axios.interceptors.request.use(
      response => response, // 성공햇을땐 그대로 성공한채로 Pass
      // response => {
      //   console.log(response); // 콘솔로 api 통신 결과 확인
      //   return response;
      // },
      async error => {
        const {
          config, // 원래 요청
          response: {status},
        } = error; // error.response.status로 해석
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config; // 임시 저장
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            // token refresh 요청
            const {data} = await axios.post(
              `http://localhost:3105/refreshToken`, // token refresh api
              {},
              {headers: {authorization: `Bearer ${refreshToken}`}},
            );
            // 새로운 토큰 저장
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            // 무조건 소문자 authorization으로 하자
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`; // 임시 저장했던 요청에 새로운 토큰 넣어줌(바꿔치기)
            return axios(originalRequest);
          }
        }
        // 419가 아니면 그냥 error를 return
        // 다른 api의 에러들도 이걸거치나 이건 결국 제자리 복귀에 불가함 ㄱㅊ
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(
          `http://localhost:3105/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        // @ts-ignore
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      // 서버한테 데이터 받는거 -> emit
      socket.emit('acceptOrder', 'hello');
      // 서버한테 데이터 보내는거 -> on
      socket.on('order', callback);
    }
    // useEffect의 return은 cleanup 함수. 컴포넌트의 unmount 시점
    // useEffect 복습
    // (1) (마운트)컴포넌트가 렌더링 될 때 작업을 실행한다.
    // (2) (업데이트)deps로 특정 값이 변화할때마다 실행할 수도 있다.

    // useEffect(() => {
    //   // (1)mount 시점, deps update 시점에 실행할 작업 (componentDidMount)
    //   return () => {
    //     //(3)unmount 시점, deps update 직전에 실행할 작업 (componentWillUnmount)
    //   };
    // }, [(2)deps]);

    //(3) Unmount
    return () => {
      if (socket) {
        // 서버와 통신 끊기
        socket.off('order', callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]); // (2) deps: deps에 있는 값이 바뀔 때마다 useEffect의 콜백이 실행된다.

  useEffect(() => {
    // logout 시 통신 끊기
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config;
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            // token refresh 요청
            const {data} = await axios.post(
              `http://localhost:3105/refreshToken`, // token refresh api
              {},
              {headers: {authorization: `Bearer ${refreshToken}`}},
            );
            // 새로운 토큰 저장
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
            // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  return isLoggedIn ? (
    <Tab.Navigator>
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{title: '오더 목록'}}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{title: '내 오더'}}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{title: '내 정보'}}
      />
    </Tab.Navigator>
  ) : (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{title: '로그인'}}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{title: '회원가입'}}
      />
    </Stack.Navigator>
  );
}

export default AppInner;
