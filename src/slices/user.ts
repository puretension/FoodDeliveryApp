import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// store -> root reducer(state) -> userSlice, orderSlice
// state.user.email
// state.order.orderItems
// state.ui.loading -> 로딩 상태를 관리하는 reducer

// action: state를 변경하는 행위/동작(명사)
// dispatch: 그 액션을 실제로 실행하는 함수(동사) -> dispatch(userSlice.actions.setUser({email: '...', name: '...'}))
// reducer: action이 실제로 실행되면 state 변경하는 로직(setter)

const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  // 동기 action
  // 여기서는 state를 변경하는 action을 정의
  reducers: {
    // 여러개 데이터 보내야할때에는 payload에 객체로 보내면 된다.
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
    // 단순한 1,2개 데이터 보낼때에는 payload에 그냥 데이터를 보내면 된다.
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    setMoney(state, action: PayloadAction<number>) {
      state.money = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
