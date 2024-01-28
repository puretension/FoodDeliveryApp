import React from 'react';
import {Text, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App.tsx';
import Ing from './Ing.tsx';
import Complete from './Complete.tsx';

const Stack = createNativeStackNavigator();

function Delivery() {
  // Stack.Screen 컴포넌트를 사용하여 Ing 위에 Complete가 쌓임
  return (
    <Stack.Navigator initialRouteName="Ing">
      <Stack.Screen name="Ing" component={Ing} />
      <Stack.Screen name="Complete" component={Complete} />
    </Stack.Navigator>
  );
}

export default Delivery;
