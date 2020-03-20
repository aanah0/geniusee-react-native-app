/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Body,
  Button,
  CheckBox,
  Content,
  Form,
  Input,
  Item,
  Label,
  ListItem,
  Text,
  Textarea
} from 'native-base';
import { RouteProp } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';
import { TaskItem } from '../common/TMTaskItem';
import { RootStackParamList } from '../../../App';
import { EDIT_TASK } from '../../contstants/gql';

type EditTaskScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditTask'
>;

interface EditTaskProps extends TaskItem {
  navigation: EditTaskScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'EditTask'>;
}

export default function EditTaskScreen({ route, navigation }: EditTaskProps) {
  const { id } = route.params;
  const [title, setTitle] = useState(route.params.title);
  const [description, setDescription] = useState(route.params.description);
  const [isDone, setIsDone] = useState(route.params.isDone);
  const [updateTask] = useMutation(EDIT_TASK, {
    variables: {
      title,
      description,
      isDone,
      id
    },
    optimisticResponse: true
  });

  return (
    <Content>
      <Form>
        <Item stackedLabel>
          <Label>Title</Label>
          <Input value={title} onChangeText={setTitle} />
        </Item>
        <Item stackedLabel bordered={false}>
          <Label>Description</Label>
          <Textarea
            style={styles.textArea}
            underline={false}
            rowSpan={3}
            bordered={false}
            value={description}
            onChangeText={setDescription}
          />
        </Item>
        <ListItem onPress={() => setIsDone(!isDone)} noBorder>
          <CheckBox onPress={() => setIsDone(!isDone)} checked={isDone} />
          <Body>
            <Text>Is done</Text>
          </Body>
        </ListItem>
      </Form>

      <Button
        style={styles.button}
        onPress={() => {
          updateTask();
          navigation.goBack();
        }}
      >
        <Text>SAVE</Text>
      </Button>
    </Content>
  );
}

const styles = StyleSheet.create({
  button: { marginHorizontal: 10 },
  textArea: { width: '100%', marginLeft: -20, marginTop: 10 }
});
