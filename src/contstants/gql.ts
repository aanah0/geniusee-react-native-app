import { gql } from 'apollo-boost';

// eslint-disable-next-line import/prefer-default-export
export const ADD_NEW_TASK = gql`
  mutation MyMutation($title: String!) {
    createTask(input: { task: { title: $title, description: "", userId: 1 } }) {
      task {
        description
        createdAt
        id
        isDone
        title
        userId
      }
    }
  }
`;

export const EDIT_TASK = gql`
  mutation MyMutation(
    $title: String!
    $description: String!
    $id: Int!
    $isDone: Boolean!
  ) {
    updateTaskById(
      input: {
        taskPatch: { title: $title, description: $description, isDone: $isDone }
        id: $id
      }
    ) {
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

export const GET_TASKS = gql`
  query MyQuery {
    allTasks {
      nodes {
        createdAt
        description
        id
        isDone
        title
        userId
      }
    }
  }
`;

export const TOGGLE_IS_DONE = gql`
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
