import React from 'react';
import {Text, View, Pressable} from 'react-native';
function Setting() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      <Pressable onPress={() => setCount(p => p + 1)}>
        <Text>{count}</Text>
      </Pressable>
    </View>
  );
}

export default Setting;
