/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardEventName,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import { Input } from 'native-base';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { useMutation } from '@apollo/react-hooks';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import { TasksProvider } from '../../store/TasksContext';
import TasksList from './TasksList';
import { TaskItem } from '../common/TMTaskItem';
import { RootStackParamList } from '../../../App';
import { ADD_NEW_TASK, GET_TASKS } from '../../contstants/gql';

const isIOS = Platform.OS === 'ios';

const keyBoardListenerNames: KeyboardEventName[] = isIOS
  ? ['keyboardWillShow', 'keyboardWillHide']
  : ['keyboardDidShow', 'keyboardDidHide'];

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeProps extends TaskItem {
  navigation: HomeScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'Home'>;
}

export default function HomeScreen(props: HomeProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const marginBottomAnimated = new Animated.Value(0);

  const [addNewTask] = useMutation(ADD_NEW_TASK, {
    optimisticResponse: true,
    update(cache, { data }) {
      const { allTasks } = cache.readQuery({
        query: GET_TASKS
      });
      if (data && data !== true && data.createTask) {
        cache.writeQuery({
          query: GET_TASKS,
          data: {
            allTasks: {
              __typename: 'TasksConnection',
              nodes: allTasks.nodes.concat([data.createTask.task])
            }
          }
        });
      }
    }
  });

  useFocusEffect(
    React.useCallback(() => {
      function keyboardDidShow(e: {
        endCoordinates: { height: number; screenY: number };
      }) {
        const { height } = e.endCoordinates;
        Animated.timing(marginBottomAnimated, {
          // 30 - is magic number. Android can getting wrong value, so that just a insurance
          toValue: isIOS ? height : height + 30,
          duration: 250
        }).start();
      }
      function keyboardDidHide() {
        Animated.timing(marginBottomAnimated, {
          toValue: 0,
          duration: 200
        }).start();
      }

      Keyboard.addListener(keyBoardListenerNames[0], keyboardDidShow);
      Keyboard.addListener(keyBoardListenerNames[1], keyboardDidHide);

      return () => {
        Keyboard.removeListener(keyBoardListenerNames[0], keyboardDidShow);
        Keyboard.removeListener(keyBoardListenerNames[1], keyboardDidHide);
      };
    }, [marginBottomAnimated])
  );

  return (
    <TasksProvider>
      <Animated.View
        enableAutomaticScroll={false}
        keyboardShouldPersistTaps
        contentContainerStyle={{ flex: 1 }}
        style={{ flex: 1, marginBottom: marginBottomAnimated }}
      >
        <TasksList
          onPressItem={(item: TaskItem) => {
            props.navigation.navigate('EditTask', { ...item });
          }}
        />
        <View style={[styles.inputContainer]}>
          <Input
            style={styles.input}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            placeholder="Add task"
          />
          <TouchableHighlight
            onPress={() => {
              if (newTaskTitle.length > 0) {
                addNewTask({
                  variables: {
                    title: newTaskTitle
                  }
                });
                setNewTaskTitle('');
              }
            }}
            style={styles.addNewTaskButton}
          >
            <AntDesign name="arrowup" size={20} color="#fff" />
          </TouchableHighlight>
        </View>
      </Animated.View>
    </TasksProvider>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#d6d6d6',
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0
  },
  input: {
    borderRadius: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginRight: 10
  },
  addNewTaskButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    backgroundColor: '#3e61c9',
    borderRadius: 15
  }
});
