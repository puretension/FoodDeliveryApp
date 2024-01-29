import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

//KeyboardAwareScrollView는 npm i @types/react-native-keyboard-aware-scrollview 후에
//types폴더에 react-native-keyboard-aware-scrollview.d.ts로 파일명 제작( .d.ts가 포인트!)
// 아래 코드 그대로 삽입
// declare module 'react-native-keyboard-aware-scrollview' {
//     import * as React from 'react';
//     import {Constructor, ViewProps} from 'react-native';
//     class KeyboardAwareScrollViewComponent extends React.Component<ViewProps> {}
//     const KeyboardAwareScrollViewBase: KeyboardAwareScrollViewComponent &
//         Constructor<any>;
//     class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
//     export {KeyboardAwareScrollView};
// }

// @ts-ignore
const DismissKeyboardView = ({children, ...props}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView {...props} style={props.style}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
