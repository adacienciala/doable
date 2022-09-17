import { Box, Group, Text } from "@mantine/core";
import { isAfter } from "date-fns";
import { AddButton } from "../../../components/AddButton";
import { TaskList } from "../../../containers/TaskList";
import { CalendarViewProps } from "../../Calendar/CalendarView";

export const CalendarBacklog = ({
  tasks,
  handleTaskDone,
  handleTaskOnFinish,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) => {
  return (
    <Box
      sx={() => ({
        flexGrow: 1,
      })}
    >
      <Group
        sx={() => ({
          marginBottom: "20px",
        })}
        data-tut="backlog"
      >
        <Text weight={"bold"}>Backlog</Text>
        <AddButton
          sx={() => ({
            marginLeft: "auto",
          })}
          onClick={() => onAddTask()}
          data-tut="add-task"
        />
      </Group>

      <TaskList
        tasks={tasks.filter((t) => {
          return !(t.date && isAfter(t.date, new Date()));
        })}
        view="backlog"
        handleTaskDone={handleTaskDone}
        handleTaskOnFinish={handleTaskOnFinish}
        onTaskClick={onTaskClick}
      />
    </Box>
  );
};
