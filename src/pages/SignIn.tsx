import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../AppInner';
import Config from 'react-native-config';
import axios, {AxiosError} from 'axios';
import {useAppDispatch} from '../store';
import userSlice from '../slices/user';
import EncryptedStorage from 'react-native-encrypted-storage';
import DismissKeyboardView from '../components/DismissKeyboardView';

// 암기해도될듯. 이런식으로 만들고 밑에 navigation 선언,
// navigation.navigate('SignUp'); 이런식으로 사용
type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false); // 로딩중인지 아닌지
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null); // null 안하면 undefined 에러
  const passwordRef = useRef<TextInput | null>(null);

  // 코드 가독성 높이기 위해 canGoNext 변수로 분리
  const canGoNext = email && password;

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim());
  }, []);

  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim());
  }, []);

  //react-native-status-bar-height 로 상태바 높이 구함

  const onSubmit = useCallback(async () => {
    console.log(Config.API_URL);
    console.log('her');
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      Alert.alert('알림', '이메일을 입력해주세요!');
    }
    if (!password || !password.trim()) {
      Alert.alert('알림', '비밀번호를 입력해주세요!');
    } else {
      try {
        setLoading(true);
        const response = await axios.post(`http://localhost:3105/login`, {
          email,
          password,
        });
        console.log(response.data);
        Alert.alert('알림', '로그인 되었습니다!');
        // 실질적 action을 dispatch하는 부분❕
        dispatch(
          userSlice.actions.setUser({
            email: response.data.data.email,
            name: response.data.data.name,
            accessToken: response.data.data.accessToken,
          }),
        );
        // dispatch(userSlice.actions.setName(response.data.data.name));
        // EncryptedStorage에 refreshToken 저장
        await EncryptedStorage.setItem(
          'refreshToken',
          response.data.data.refreshToken,
        );
        console.log(response.data.data.refreshToken);
        // 가져올때
        // const value = await EncryptedStorage.getItem('refreshToken');
        // 제거할때
        // await EncryptedStorage.removeItem('accessToken');
      } catch (error) {
        const errorResponse = (error as AxiosError).response;
        console.log(errorResponse);
        if (errorResponse) {
          // @ts-ignore
          Alert.alert('알림', errorResponse.data.message);
        }
      } finally {
        setLoading(false);
      }
    }
  }, [loading, dispatch, email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일을 입력해주세요!"
            value={email}
            onChangeText={onChangeEmail}
            importantForAutofill="yes" // iOS에서 자동완성 기능을 사용하려면 필요
            autoComplete="email" // Android에서 자동완성 기능을 사용하려면 필요
            keyboardType={'email-address'} // 이메일 형식으로 키보드 띄움
            returnKeyType={'next'}
            onSubmitEditing={() => {
              passwordRef.current?.focus(); // email 입력 후 password로 자동 넘어감
            }}
            ref={emailRef}
            blurOnSubmit={false} // 입력의 끝에 해당하는 텍스트필드가 아니라면 false로
            clearButtonMode={'while-editing'}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="비밀번호를 입력해주세요!"
            secureTextEntry // 숨기기
            onChangeText={onChangePassword}
            autoComplete="password" // Android에서 자동완성 기능을 사용하려면 필요
            textContentType="emailAddress"
            ref={passwordRef}
            blurOnSubmit={true}
            onSubmitEditing={onSubmit} // 비번 입력후 완료버튼 누르면 onSubmit 함수 자동 수행
          />
        </View>
        <View style={styles.buttonZone}>
          <Pressable
            style={
              canGoNext
                ? StyleSheet.compose(
                    styles.loginButton,
                    styles.loginButtonActive,
                  )
                : styles.loginButton
            }
            disabled={!canGoNext || loading}
            onPress={onSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>로그인</Text>
            )}
          </Pressable>
          <Pressable style={styles.signupButton} onPress={toSignUp}>
            <Text>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    fontWeight: 'bold',
    fontSize: 16,
    borderBottomWidth: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
  },
  buttonZone: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonActive: {
    backgroundColor: 'red',
  },
  loginButtonText: {
    color: 'white',
  },
  signupButton: {
    // Additional styles for signup button if needed
  },
});

export default SignIn;
