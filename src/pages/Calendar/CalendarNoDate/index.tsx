import { Box, Text } from "@mantine/core";
import { TaskData } from "../../../components/TaskPill";
import { TaskList } from "../../../containers/TaskList";

export const CalendarNoDate = ({ tasks }: { tasks: TaskData[] }) => {
  return (
    <>
      <Text weight={"bold"} style={{ marginBottom: "20px" }}>
        Not scheduled
      </Text>
      <Box>
        <TaskList tasks={tasks} view="no-date" />
      </Box>
    </>
  );
};
