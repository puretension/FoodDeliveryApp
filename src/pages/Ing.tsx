import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import NaverMapView, {Marker, Path} from 'react-native-nmap';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';

type IngScreenProps = NativeStackScreenProps<LoggedInParamList, 'Delivery'>;

//⭐️️팝핀에서 현위치 조회할때 꼭 필요함. 숙달⭐️️

function Ing({navigation}: IngScreenProps) {
  console.dir(navigation); // 이렇게 navigation을 확인해보면, push, goBack, navigate 등의 메소드가 있다.
  const deliveries = useSelector((state: RootState) => state.order.deliveries);
  // 내 위치 가져오기
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 조회하는 위치가 바뀔때마다 실행
  useEffect(() => {
    // getCurrentPosition은 한번만 위치를 가져옴(한번만 실행됨)
    Geolocation.getCurrentPosition(
      info => {
        // 사용자의 현위치를 가져옴
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error,
      {
        enableHighAccuracy: true, // 정확도 높게
        timeout: 20000, // 20초안에 못가져오면 에러
      },
    );
    // // watchPosition은 계속해서 위치를 감시함(실시간으로 위치를 가져옴)
    // Geolocation.watchPosition(
    //   info => {
    //     // 사용자의 현위치를 가져옴
    //     setMyPosition({
    //       latitude: info.coords.latitude,
    //       longitude: info.coords.longitude,
    //     });
    //   },
    //   console.error,
    //   {
    //     enableHighAccuracy: true, // 정확도 높게
    //     timeout: 20000, // 20초안에 못가져오면 에러
    //   },
    // );
  }, []);

  // 주문이 없을때
  if (!deliveries?.[0]) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>주문을 먼저 수락해주세요!</Text>
      </View>
    );
  }

  // 내 위치가 없을때
  if (!myPosition || !myPosition.latitude) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>내 위치를 로딩 중입니다. 권한을 허용했는지 확인해주세요.</Text>
      </View>
    );
  }

  // 수락한거 좌표 가져오기
  const {start, end} = deliveries?.[0];

  return (
    <View>
      <View
        // 화면 꽉 채워
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
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
          {myPosition?.latitude && (
            <Marker
              coordinate={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
              }}
              width={15}
              height={15}
              anchor={{x: 0.5, y: 0.5}}
              caption={{text: '나'}}
              image={require('../assets/red-dot.png')}
            />
          )}
          {myPosition?.latitude && (
            <Path
              coordinates={[
                {
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                },
                {latitude: start.latitude, longitude: start.longitude},
              ]}
              color="orange"
            />
          )}
          <Marker
            coordinate={{
              latitude: start.latitude,
              longitude: start.longitude,
            }}
            width={15}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '출발'}}
            image={require('../assets/blue-dot.png')}
          />
          <Path
            coordinates={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              {latitude: end.latitude, longitude: end.longitude},
            ]}
            color="orange"
          />
          <Marker
            coordinate={{latitude: end.latitude, longitude: end.longitude}}
            width={15}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '도착'}}
            image={require('../assets/green-dot.png')}
            onClick={() => {
              console.log(navigation);
              // 주문 완료 페이지로 이동(팝핀에서 상세 페이지 이동할때 이처럼 navigate)
              navigation.push('Complete', {orderId: deliveries[0].orderId});
            }}
          />
        </NaverMapView>
      </View>
    </View>
  );
}

export default Ing;
