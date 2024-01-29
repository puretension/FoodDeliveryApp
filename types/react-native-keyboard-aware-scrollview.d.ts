//typescript 문법 제대로 공부후 다시보기
declare module 'react-native-keyboard-aware-scrollview' {
  import * as React from 'react';
  import {Constructor, ViewProps} from 'react-native';
  class KeyboardAwareScrollViewComponent extends React.Component<ViewProps> {}
  const KeyboardAwareScrollViewBase: KeyboardAwareScrollViewComponent &
    Constructor<any>;
  class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export {KeyboardAwareScrollView};
}
