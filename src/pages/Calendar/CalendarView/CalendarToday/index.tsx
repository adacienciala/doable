import { Box, Text } from "@mantine/core";
import { format, isSameDay } from "date-fns";
import { CalendarViewProps } from "..";
import { TaskList } from "../../../../containers/TaskList";

export const CalendarToday = ({
  tasks,
  onTaskDone,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) => {
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
        tasks={tasks.filter((t) =>
          t.date ? isSameDay(t.date, new Date()) : false
        )}
        view="today"
        onTaskDone={onTaskDone}
        onTaskClick={onTaskClick}
      />
    </>
  );
};
