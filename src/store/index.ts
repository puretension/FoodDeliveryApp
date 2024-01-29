import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import rootReducer from './reducer';

// slice가 모여서 reducer가 되고, reducer가 모여서 store가 된다.

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    if (__DEV__) {
      const createDebugger = require('redux-flipper').default;
      return getDefaultMiddleware().concat(createDebugger());
    }
    return getDefaultMiddleware();
  },
});
export default store;

// 타입스크립트에서는 useSelector를 사용할때 타입을 지정해줘야하는데,
// 이를 위해 아래와 같이 타입을 지정해준다.
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
