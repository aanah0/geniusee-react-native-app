import React, { createRef } from 'react';
import { FlatList } from 'react-native';
import { useTasksState } from '../../store/TasksContext';
import TMTaskItem, { TaskItem } from '../common/TMTaskItem';

export default function TasksList({
  onPressItem
}: {
  onPressItem(item: TaskItem): void;
}) {
  const state = useTasksState();
  const scroll = createRef<FlatList<TaskItem>>();

  // useEffect(() => {
  //   if (scroll && scroll.current) {
  //     scroll.current.scrollToEnd();
  //   }
  // }, [state.list.length]);

  return (
    <FlatList
      removeClippedSubviews
      ref={scroll}
      style={{ flex: 1, marginBottom: 60 }}
      refreshing={state.isLoading}
      onRefresh={state.refetch}
      data={state.list}
      getItemLayout={(_data, index) => ({
        length: 46.5,
        offset: 46.5 * index,
        index
      })}
      keyExtractor={i => `${i.id}`}
      renderItem={({ item }) => {
        return <TMTaskItem {...item} onPress={() => onPressItem(item)} />;
      }}
    />
  );
}
