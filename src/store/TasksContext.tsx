/* eslint-disable max-len */
import React, { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { TaskItem } from '../components/common/TMTaskItem';
import { AuthContext } from '../../App';
import { GET_TASKS } from '../contstants/gql';

type State = {
  isLoading: boolean;
  list: TaskItem[];
  error: string | null;
  refetch?(): void;
};
type TasksProviderProps = { children: React.ReactNode };

const TasksStateContext = React.createContext<State | undefined>(undefined);

function TasksProvider({ children }: TasksProviderProps) {
  const authProvider = useContext(AuthContext);
  const { loading, error, data, refetch } = useQuery(GET_TASKS, {
    errorPolicy: 'all'
  });

  useEffect(() => {
    if (error) {
      if (error.message.indexOf('Received status code 401') !== -1) {
        if (authProvider) {
          authProvider.setUserToken(null);
        }
      }
    }
  }, [error, authProvider]);

  return (
    <TasksStateContext.Provider
      value={{
        list: data ? data.allTasks.nodes : [],
        isLoading: loading,
        error: error ? error.message : null,
        refetch
      }}
    >
      {children}
    </TasksStateContext.Provider>
  );
}

function useTasksState() {
  const context = React.useContext(TasksStateContext);
  if (context === undefined) {
    throw new Error('useTasksState must be used within a TasksProvider');
  }
  return context;
}

export { TasksProvider, useTasksState };
