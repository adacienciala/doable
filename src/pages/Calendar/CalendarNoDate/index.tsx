import { Box, Text } from "@mantine/core";
import { TaskData, TaskPill } from "../../../components/TaskPill";

export const CalendarNoDate = ({ tasks }: { tasks: TaskData[] }) => {
  return (
    <>
      <Text>Not scheduled</Text>
      <Box>
        {tasks.map((t, idx) => (
          <TaskPill data={t} view={"no-date"} key={idx} />
        ))}
      </Box>
    </>
  );
};
