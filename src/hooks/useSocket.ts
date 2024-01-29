import {useCallback} from 'react';
import SocketIOClient, {Socket} from 'socket.io-client';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

// socket은 1번 연결하면 계속 연결되어있는 상태로 유지되어야 한다.(전역 변수로 선언)
let socket: Socket | undefined;
const useSocket = (): [Socket | undefined, () => void] => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  const disconnect = useCallback(() => {
    if (socket && !isLoggedIn) {
      console.log(socket && !isLoggedIn, '웹소켓 연결을 해제합니다.');
      socket.disconnect();
      socket = undefined;
    }
  }, [isLoggedIn]);
  if (!socket && isLoggedIn) {
    console.log(!socket && isLoggedIn, '웹소켓 연결을 진행합니다.');
    socket = SocketIOClient(`${Config.API_URL}`, {
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
};

export default useSocket;
