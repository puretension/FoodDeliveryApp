import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import orderSlice, {Order} from '../slices/order';
import {useAppDispatch} from '../store';
import axios, {AxiosError} from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Config from 'react-native-config';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import NaverMapView, {Marker, Path} from 'react-native-nmap/index';
import getDistanceFromLatLonInKm from '../util.ts';

interface Props {
  item: Order;
}
function EachOrder({item}: {item: Order}) {
  // const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  // const dispatch = useAppDispatch();
  // const accessToken = useSelector((state: RootState) => state.user.accessToken);
  // const [detail, showDetail] = useState(false);
  const dispatch = useAppDispatch();
  //✅✅ Orders부분에 navigation선언해주는것도 방법이 될 수 잇지만(주문 수락 14:44강의 참고),이는 props drilling
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>(); // 로그인안햇을때를 원한다면 NavigationProp<RootStackParamList>
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState(false);
  const toggleDetail = useCallback(() => {
    setDetail(prevState => !prevState);
  }, []);

  const onAccept = useCallback(async () => {
    if (!accessToken) {
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${Config.API_URL}/accept`,
        {orderId: item.orderId},
        {headers: {authorization: `Bearer ${accessToken}`}},
      );
      dispatch(orderSlice.actions.acceptOrder(item.orderId));
      setLoading(false); //페이지 이동(navigation.navigate()) 전에 해줘!
      //컴포넌트가 언마운트될때에는(페이지 이동이 있을시에는) finally setloading(false) 하지말자.
      navigation.navigate('Delivery');
    } catch (error) {
      const errorResponse = (error as AxiosError).response;
      if (errorResponse?.status === 400) {
        // 타인이 이미 수락한 경우⭐️
        // @ts-ignore
        Alert.alert('알림', errorResponse.data.message);
        dispatch(orderSlice.actions.rejectOrder(item.orderId));
      }

      // 아래의 중복을 axios의 interceptors로 처리
      // if (errorResponse?.status === 419) {
      //   // refresh 코드
      //   const refreshToken = await EncryptedStorage.getItem('refreshToken');
      //   const response = await axios.post(
      //     `${Config.API_URL}/refreshToken`,
      //     {},
      //     {
      //       headers: {
      //         authorization: `Bearer ${refreshToken}`,
      //       },
      //     },
      //   );
      //   await axios.post(
      //     `${Config.API_URL}/accept`,
      //     {orderId: item.orderId},
      //     {
      //       headers: {
      //         authorization: `Bearer ${response.data.data.accessToken}`,
      //       },
      //     },
      //   );
      // }
    } finally {
      // setLoading(false); //페이지 이동(navigation.navigate()
      //컴포넌트가 언마운트될때에는(페이지 이동이 있을시에는) finally setloading(false) 하지말자..
    }
    dispatch(orderSlice.actions.acceptOrder(item.orderId));
  }, [navigation, dispatch, item, accessToken]);

  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId));
  }, [dispatch, item]);

  const {start, end} = item;

  // const onAccept = useCallback(() => {
  //   dispatch(orderSlice.actions.acceptOrder(item.orderId));
  // }, [dispatch, item.orderId]);
  // const onReject = useCallback(() => {
  //   dispatch(orderSlice.actions.rejectOrder(item.orderId));
  // }, [dispatch, item.orderId]);

  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text style={styles.eachInfo}>
          {getDistanceFromLatLonInKm(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude,
          ).toFixed(1)}
          km
        </Text>
      </Pressable>
      {detail && (
        <View>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 200,
              marginTop: 10,
            }}>
            <NaverMapView
              style={{width: '100%', height: '100%'}}
              zoomControl={false}
              center={{
                zoom: 10,
                tilt: 50,
                latitude: (start.latitude + end.latitude) / 2,
                longitude: (start.longitude + end.longitude) / 2,
              }}>
              <Marker
                coordinate={{
                  latitude: start.latitude,
                  longitude: start.longitude,
                }}
                pinColor="blue"
              />
              <Path
                coordinates={[
                  {
                    latitude: start.latitude,
                    longitude: start.longitude,
                  },
                  {latitude: end.latitude, longitude: end.longitude},
                ]}
              />
              <Marker
                coordinate={{latitude: end.latitude, longitude: end.longitude}}
              />
            </NaverMapView>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onAccept} style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable onPress={onReject} style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );

  // return (
  //     <View key={item.orderId} style={styles.orderContainer}>
  //       <Pressable onPress={toggleDetail} style={styles.info}>
  //         <Text style={styles.eachInfo}>
  //           {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
  //         </Text>
  //         <Text>삼성동</Text>
  //         <Text>왕십리동</Text>
  //       </Pressable>
  //       {detail ? (
  //           <View>
  //             <View>
  //               <Text>네이버맵이 들어갈 장소</Text>
  //             </View>
  //             <View style={styles.buttonWrapper}>
  //               <Pressable
  //                   onPress={onAccept}
  //                   disabled={loading}
  //                   style={styles.acceptButton}>
  //                 <Text style={styles.buttonText}>수락</Text>
  //               </Pressable>
  //               <Pressable onPress={onReject} style={styles.rejectButton}>
  //                 <Text style={styles.buttonText}>거절</Text>
  //               </Pressable>
  //             </View>
  //           </View>
  //       ) : null}
  //     </View>
  // );
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 5,
    padding: 10,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eachInfo: {
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  acceptButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: 'red',
    alignItems: 'center', // 버튼내에서 텍스트 가운데 정렬
    paddingVertical: 10,
    borderBottomRightRadius: 5, // 오른쪽 둥글게
    borderTopRightRadius: 5, // 왼쪽 둥글게
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EachOrder;
