import React from 'react';
import { Body, CheckBox, ListItem, Text } from 'native-base';
import { useMutation } from '@apollo/react-hooks';
import { TOGGLE_IS_DONE } from '../../contstants/gql';

export interface TaskItem {
  createdAt: string;
  description: string;
  id: number;
  isDone: boolean;
  title: string;
  userId: number;
}

export interface TaskItemUpdatableFields {
  description?: string;
  isDone?: boolean;
  title?: string;
}

interface TMTaskItemProps extends TaskItem {
  onPress(): void;
}

const TMTaskItem = React.memo(
  ({ isDone, createdAt, description, title, id, onPress }: TMTaskItemProps) => {
    const [toggle] = useMutation(TOGGLE_IS_DONE, {
      variables: {
        isDone: !isDone,
        id
      },
      optimisticResponse: () => {
        return {
          __typename: 'Mutation',
          updateTaskById: {
            __typename: 'TasksConnection',
            task: {
              __typename: 'Task',
              id,
              isDone: !isDone,
              createdAt,
              description,
              title
            }
          }
        };
      }
    });

    return (
      <ListItem onPress={onPress}>
        <CheckBox onPress={() => toggle()} checked={isDone} />
        <Body>
          <Text>{title}</Text>
        </Body>
      </ListItem>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.isDone !== nextProps.isDone) return false;
    if (prevProps.title !== nextProps.title) return false;
    return true;
  }
);

export default TMTaskItem;
