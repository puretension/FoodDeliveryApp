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
import {NavigationContainer} from '@react-navigation/native';

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
  // isLoggedIn 사용을 위해서 분리 AppInner로 App.tsx에서 분리함
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  console.log('isLoggedIn', isLoggedIn);

  // const [socket, disconnect] = useSocket();

  // useEffect(() => {
  //   const helloCallback = (data: any) => {
  //     console.log(data);
  //   };
  //   if (socket && isLoggedIn) {
  //     console.log(socket);
  //     socket.emit('login', 'hello');
  //     socket.on('hello', helloCallback);
  //   }
  //   return () => {
  //     if (socket) {
  //       socket.off('hello', helloCallback);
  //     }
  //   };
  // }, [isLoggedIn, socket]);
  //
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     console.log('!isLoggedIn', !isLoggedIn);
  //     disconnect();
  //   }
  // }, [isLoggedIn, disconnect]);

  return (
    <>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tab.Navigator>
            <Tab.Screen
              name="Orders"
              component={Orders}
              options={{title: '오더 목록'}}
            />
            <Tab.Screen
              name="Delivery"
              component={Delivery}
              options={{headerShown: false}}
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
        )}
      </NavigationContainer>
    </>
  );
}

export default AppInner;
