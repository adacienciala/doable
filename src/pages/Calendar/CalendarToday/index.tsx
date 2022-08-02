import { Text } from "@mantine/core";
import { format, isSameDay } from "date-fns";
import { TaskData } from "../../../components/TaskPill";
import { TaskList } from "../../../containers/TaskList";

export const CalendarToday = ({ tasks }: { tasks: TaskData[] }) => {
  return (
    <>
      <Text weight={"bold"} style={{ display: "inline-block" }}>
        Today
      </Text>
      <Text style={{ display: "inline-block" }}>
        {format(Date.now(), "EEEE, do MMM")}
      </Text>
      <TaskList
        tasks={tasks.filter((t) => isSameDay(t.date, new Date()))}
        view="today"
      />
    </>
  );
};
