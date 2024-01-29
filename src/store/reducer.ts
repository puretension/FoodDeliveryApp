import {combineReducers} from 'redux';

import userSlice from '../slices/user';

// 전체 Reducer를 하나로 합침
const rootReducer = combineReducers({
  user: userSlice.reducer,
  // order: orederSlice.reducer,
});

// RootState 타입으로 리턴(타입에러 X).
// 이게없으면 useSelector를 사용할때 타입을 일일이 지정해줘야함.
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
