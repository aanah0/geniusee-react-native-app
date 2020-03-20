import React from 'react';
import { Body, CheckBox, ListItem, Text } from 'native-base';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';

const TOGGLE_IS_DONE = gql`
  mutation MyMutation($id: Int!, $isDone: Boolean!) {
    updateTaskById(input: { taskPatch: { isDone: $isDone }, id: $id }) {
      task {
        description
        createdAt
        id
        isDone
        title
      }
    }
  }
`;

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
  ({ isDone, title, id, onPress }: TMTaskItemProps) => {
    const [toggle] = useMutation(TOGGLE_IS_DONE, {
      variables: {
        isDone: !isDone,
        id
      },
      optimisticResponse: true
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
