/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
  Alert,
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Button } from 'native-base';
import { persistCache } from 'apollo-cache-persist';
import SignInScreen from './src/components/auth/SignInScreen';
import HomeScreen from './src/components/home/HomeScreen';
import EditTask from './src/components/home/EditTaskScreen';
import { TaskItem } from './src/components/common/TMTaskItem';

const isIOS = Platform.OS === 'ios';

type AuthFunctionInContext = {
  userName: string;
  password: string;
};

type State = {
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  signIn({ userName, password }: AuthFunctionInContext): Promise<void>;
  signUp({ userName, password }: AuthFunctionInContext): Promise<void>;
};

export type RootStackParamList = {
  Home: undefined;
  EditTask: TaskItem;
};

const AuthContext = React.createContext<State | undefined>(undefined);

const Stack = createStackNavigator();

function App() {
  const [isReady, setIsReady] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [client, setClient] = useState<null | ApolloClient<unknown>>(null);

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
        // We are checked and go user to home
        setUserToken(token);
      }
    }
    loadFonts();
    checkUserToken();
  }, []);

  useEffect(() => {
    const cache = new InMemoryCache();

    const clientWithToken = new ApolloClient({
      cache,
      uri: 'http://192.168.0.101:3000/graphql',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    });
    const initData = {};
    cache.writeData({ data: initData });
    persistCache({
      cache,
      storage: AsyncStorage,
      trigger: 'write'
    }).then(() => {
      clientWithToken.onResetStore(async () =>
        cache.writeData({ data: initData })
      );
      setClient(clientWithToken);
    });
  }, [userToken]);

  if (!isReady || !client) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isIOS && <StatusBar barStyle="dark-content" />}
      <ApolloProvider client={client}>
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
            },
            signIn: async ({ userName, password }) => {
              try {
                const token = await authorize({
                  userName,
                  password,
                  action: 'signin'
                });
                AsyncStorage.setItem('userToken', token);
                setUserToken(token);
              } catch (e) {
                Alert.alert('Error', e.message);
              }
            },
            signUp: async ({ userName, password }) => {
              try {
                await authorize({ userName, password, action: 'signup' });
                const token = await authorize({
                  userName,
                  password,
                  action: 'signin'
                });
                AsyncStorage.setItem('userToken', token);
                setUserToken(token);
              } catch (e) {
                Alert.alert('Error', e.message);
              }
            }
          }}
        >
          <Stack.Navigator>
            {!userToken ? (
              <Stack.Screen name="SignInScreen" component={SignInScreen} />
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  options={() => ({
                    headerLeft: () => (
                      <Button
                        style={{ marginLeft: 8 }}
                        transparent
                        onPress={() => {
                          setUserToken(null);
                        }}
                      >
                        <Text style={{ color: 'red' }}>Log out</Text>
                      </Button>
                    )
                  })}
                  component={HomeScreen}
                />
                <Stack.Screen name="EditTask" component={EditTask} />
              </>
            )}
          </Stack.Navigator>
        </AuthContext.Provider>
      </ApolloProvider>
    </NavigationContainer>
  );
}

async function authorize({
  userName,
  password,
  action
}: {
  userName: string;
  password: string;
  action: 'signin' | 'signup';
}) {
  try {
    const resp = await axios({
      method: 'POST',
      data: {
        username: userName,
        password
      },
      url: `http://192.168.0.101:3000/${action}`
    });
    if (resp.data.status === 'ok') {
      return action === 'signin' ? resp.data.token : true;
    }
    throw new Error(resp.data.message);
  } catch (e) {
    throw new Error(e.message);
  }
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
