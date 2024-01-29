import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer.ts';
import {Order} from '../slices/order.ts';
import EachOrder from '../components/EachOrder.tsx';
function Orders() {
  const orders = useSelector((state: RootState) => state.order.orders);
  const renderItem = useCallback(({item}: {item: Order}) => {
    return <EachOrder item={item} />;
  }, []);

  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
      />
    </View>
  );
}

export default Orders;
// redux에 있는건 useSelector로 가져옴
// 서버통신 데이터, 반복문의 경우에는 ScrollView 대신 FlatList 사용
