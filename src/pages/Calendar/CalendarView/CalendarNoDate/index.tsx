import { Group, Text } from "@mantine/core";
import { CalendarViewProps } from "..";
import { AddButton } from "../../../../components/AddButton";
import { TaskList } from "../../../../containers/TaskList";

export const CalendarNoDate = ({
  tasks,
  handleTaskDone,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) => {
  return (
    <>
      <Group
        sx={(theme) => ({
          justifyContent: "space-between",
        })}
      >
        <Text weight={"bold"}>Not scheduled</Text>
        <AddButton onClick={(e) => onAddTask()} />
      </Group>
      <TaskList
        tasks={tasks.filter((t) => !t.date)}
        view="no-date"
        handleTaskDone={handleTaskDone}
        onTaskClick={onTaskClick}
      />
    </>
  );
};
