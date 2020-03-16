import React, { useEffect, useState } from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import SignInScreen from './src/components/auth/SignInScreen';
import HomeScreen from './src/components/home/HomeScreen';

type State = {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
};

const AuthContext = React.createContext<State | undefined>(undefined);

const Stack = createStackNavigator();

function App() {
  const [isReady, setIsReady] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        // eslint-disable-next-line @typescript-eslint/camelcase
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font
      });
      setIsReady(true);
    }
    async function checkUserToken() {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        console.log('We are checked and go user to home');
        setUserToken(token);
      }
    }
    loadFonts();
    checkUserToken();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AuthContext.Provider
        value={{
          userToken,
          setUserToken: token => {
            if (token !== null) {
              AsyncStorage.setItem('userToken', token.toString());
            } else {
              AsyncStorage.removeItem('userToken');
            }
            return setUserToken(token);
          }
        }}
      >
        <Stack.Navigator>
          {!userToken ? (
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
          ) : (
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </AuthContext.Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App;
export { AuthContext };
