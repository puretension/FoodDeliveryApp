import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import {useState} from 'react';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';

// 특정 스크린들간의 공통 속성이 있을때 Tab.Group을 사용

export type LoggedInParamList = {
  Orders: undefined; // 주문 화면
  Settings: undefined; // 설정 화면
  Delivery: undefined; // 배달 화면
  Complete: {orderId: string}; // 배달 완료 화면, 주문번호(id)를 넘겨줌
};

// SignIn, SignUp 화면을 위한 타입(실수 방지
export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  return (
    <NavigationContainer>
      {/*isLoggedIn이 true면 Tab.Navigator, false면 Stack.Navigator*/}
      {/*Tab.Navigator와 Stack.Navigator둘다 동시에 사용 가능*/}
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
  );
}

export default App;

// NativeStackScreenProps는 스크린에 네비게이션과 라우트를 넘겨줌
// NativeStackScreenProps<ParamListBase, 'Details'> 이런식으로 쓰면
// Details 스크린에 네비게이션과 라우트를 넘겨줌

//TS는 JS에 매개변수, 리턴값, 변수에 타입을 지정한 것 뿐임
//아래의 navigation은 HomeScreenProps의 navigation

// JustifyContent는 세로축 정렬, alignItems는 가로축 정렬
// justifyContent에는 flex-start, flex-end, center,
// space-between, space-around, space-evenly
// alignItems에는 flex-start, flex-end, center, stretch, baseline
// button 종류는 touchableopacity, ⭐pressable⭐️, TouchableNativeFeedback, touchablehighlight,(더잇지만 쓸만한건 이정도)

//NavigationContainer는 루트 네비게이션 컨테이너
//Stack.Navigator는 스택 네비게이션 컨테이너
//Stack.screen은 스택 네비게이션 컨테이너의 화면
// 스크린이 컴포넌트한테 네비게이션과 라우트를 넘겨줌
