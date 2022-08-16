import { Box, Text } from "@mantine/core";
import { format, isSameDay } from "date-fns";
import { TaskData } from "../../../components/TaskPill";
import { TaskList } from "../../../containers/TaskList";

export const CalendarToday = ({
  tasks,
  onTaskDone,
}: {
  tasks: TaskData[];
  onTaskDone: (taskId: string) => void;
}) => {
  return (
    <>
      <Box style={{ marginBottom: "20px" }}>
        <Text
          weight={"bold"}
          style={{ display: "inline-block", marginRight: "10px" }}
        >
          Today
        </Text>
        <Text style={{ display: "inline-block" }}>
          {format(Date.now(), "EEEE, do MMM")}
        </Text>
      </Box>

      <TaskList
        tasks={tasks.filter((t) => isSameDay(t.date, new Date()))}
        view="today"
        onTaskDone={onTaskDone}
      />
    </>
  );
};
