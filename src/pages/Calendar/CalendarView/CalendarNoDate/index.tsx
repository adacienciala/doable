import { Box, Group, Text } from "@mantine/core";
import { CalendarViewProps } from "..";
import { AddButton } from "../../../../components/AddButton";
import { TaskList } from "../../../../containers/TaskList";

export const CalendarNoDate = ({
  tasks,
  onTaskDone,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) => {
  return (
    <>
      <Group
        sx={(theme) => ({
          justifyContent: "space-between",
          marginBottom: "20px",
        })}
      >
        <Text weight={"bold"}>Not scheduled</Text>
        <AddButton onClick={(e) => onAddTask()} />
      </Group>
      <Box>
        <TaskList
          tasks={tasks.filter((t) => !t.date)}
          view="no-date"
          onTaskDone={onTaskDone}
          onTaskClick={onTaskClick}
        />
      </Box>
    </>
  );
};
