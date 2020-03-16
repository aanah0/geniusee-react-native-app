import React, { useContext } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { AuthContext } from '../../../App';

export default function SignInScreen() {
  const context = useContext(AuthContext);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>SIGN IN</Text>
      <TouchableHighlight style={{width: 100, height: 100, backgroundColor: 'red'}}
        onPress={() => context?.setUserToken('test_token')}
      >
        <View/>
      </TouchableHighlight>
    </View>
  );
}
