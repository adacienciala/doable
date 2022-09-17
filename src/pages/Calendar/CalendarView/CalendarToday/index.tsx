import { Group, Text } from "@mantine/core";
import { format, isToday } from "date-fns";
import { CalendarViewProps } from "..";
import { AddButton } from "../../../../components/AddButton";
import { TaskList } from "../../../../containers/TaskList";

export const CalendarToday = ({
  tasks,
  handleTaskDone,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) => {
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
          onClick={() => onAddTask({ date: new Date() })}
        />
      </Group>

      <TaskList
        tasks={tasks.filter((t) => (t.date ? isToday(t.date) : false))}
        view="today"
        handleTaskDone={handleTaskDone}
        onTaskClick={onTaskClick}
      />
    </>
  );
};
