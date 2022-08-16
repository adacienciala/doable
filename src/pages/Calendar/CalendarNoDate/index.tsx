import { Box, Text } from "@mantine/core";
import { TaskData } from "../../../components/TaskPill";
import { TaskList } from "../../../containers/TaskList";

export const CalendarNoDate = ({
  tasks,
  onTaskDone,
}: {
  tasks: TaskData[];
  onTaskDone: (taskId: string) => void;
}) => {
  return (
    <>
      <Text weight={"bold"} style={{ marginBottom: "20px" }}>
        Not scheduled
      </Text>
      <Box>
        <TaskList tasks={tasks} view="no-date" onTaskDone={onTaskDone} />
      </Box>
    </>
  );
};
