/* eslint-disable no-underscore-dangle */
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import {
  Button,
  Container,
  Content,
  Form,
  Input,
  Item,
  Text
} from 'native-base';
import { AuthContext } from '../../../App';

interface RightRefFromNativeBase extends Input {
  _root: TextInput;
}

export default function SignInScreen() {
  const context = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef<RightRefFromNativeBase>(null);

  return (
    <Container>
      <Content>
        <Form>
          <Item>
            <Input
              blurOnSubmit={false}
              onSubmitEditing={() => {
                // Знаю что можно написать и passwordInputRef.current?._root?.focus
                // prettier не понимает такого оператора в моей версии, надо обновить,
                // но тратить время на это не хотелось)
                if (
                  passwordInputRef &&
                  passwordInputRef.current &&
                  passwordInputRef.current._root
                ) {
                  passwordInputRef.current._root.focus();
                }
              }}
              returnKeyType="next"
              value={userName}
              onChangeText={setUserName}
              placeholder="Username"
            />
          </Item>
          <Item last>
            <Input
              onSubmitEditing={() => {
                if (context) {
                  context.signIn({ userName, password });
                }
              }}
              returnKeyType="send"
              ref={passwordInputRef}
              secureTextEntry
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
            />
          </Item>
        </Form>
        <Button
          style={styles.button}
          onPress={() => {
            if (context) {
              context.signIn({ userName, password });
            }
          }}
        >
          <Text>Sign in</Text>
        </Button>
        <Button
          style={styles.button}
          onPress={() => {
            if (context) {
              context.signUp({ userName, password });
            }
          }}
        >
          <Text>Sign UP</Text>
        </Button>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  button: { marginHorizontal: 20, marginTop: 20 }
});
