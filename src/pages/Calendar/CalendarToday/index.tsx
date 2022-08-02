import { Box, Text } from "@mantine/core";
import { format, isSameDay } from "date-fns";
import { TaskData, TaskPill } from "../../../components/TaskPill";

export const CalendarToday = ({ tasks }: { tasks: TaskData[] }) => {
  return (
    <>
      <Text weight={"bold"} style={{ display: "inline-block" }}>
        Today
      </Text>
      <Text style={{ display: "inline-block" }}>
        {format(Date.now(), "EEEE, do MMM")}
      </Text>
      <Box>
        {tasks
          .filter((t) => isSameDay(t.date, new Date()))
          .map((t, idx) => (
            <TaskPill data={t} view={"today"} key={idx} />
          ))}
      </Box>
    </>
  );
};
