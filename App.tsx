import * as React from 'react';
import {Provider} from 'react-redux';
import store from './src/store';
// import {RootState} from '@reduxjs/toolkit/query'; //❌이거 아님❌
import AppInner from './AppInner.tsx';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

function App() {
  // Provider 바깥에서는 useSelector 사용 불가하므로
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}

export default App;
