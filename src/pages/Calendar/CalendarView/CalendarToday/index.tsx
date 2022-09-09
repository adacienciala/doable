import { Group, Text } from "@mantine/core";
import { format, isSameDay } from "date-fns";
import { CalendarViewProps } from "..";
import { AddButton } from "../../../../components/AddButton";
import { TaskList } from "../../../../containers/TaskList";

export const CalendarToday = ({
  tasks,
  onTaskDone,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) => {
  const todayDate = new Date();
  return (
    <>
      <Group
        sx={() => ({
          marginBottom: "20px",
        })}
      >
        <Text weight={"bold"}>Today</Text>
        <Text>{format(Date.now(), "EEEE, do MMM")}</Text>
        <AddButton
          sx={() => ({
            marginLeft: "auto",
          })}
          onClick={() => onAddTask({ date: todayDate })}
        />
      </Group>

      <TaskList
        tasks={tasks.filter((t) =>
          t.date ? isSameDay(t.date, todayDate) : false
        )}
        view="today"
        onTaskDone={onTaskDone}
        onTaskClick={onTaskClick}
      />
    </>
  );
};
