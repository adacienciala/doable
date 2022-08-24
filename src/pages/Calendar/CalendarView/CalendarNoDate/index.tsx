import { ActionIcon, Box, Group, Text } from "@mantine/core";
import { RiAddFill } from "react-icons/ri";
import { CalendarViewProps } from "..";
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
        <ActionIcon
          color="yellow.6"
          radius="xl"
          variant="outline"
          onClick={() => onAddTask()}
        >
          <RiAddFill size={18} />
        </ActionIcon>
      </Group>
      <Box>
        <TaskList
          tasks={tasks}
          view="no-date"
          onTaskDone={onTaskDone}
          onTaskClick={onTaskClick}
        />
      </Box>
    </>
  );
};
