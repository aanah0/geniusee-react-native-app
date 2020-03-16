/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import { AuthContext } from '../../../App';

export default function HomeScreen() {
  const context = useContext(AuthContext);
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <TouchableHighlight style={{width: 100, height: 100, backgroundColor: 'red'}}
        onPress={() => context?.setUserToken(null)}
      >
        <View/>
      </TouchableHighlight>
    </View>
  );
}
