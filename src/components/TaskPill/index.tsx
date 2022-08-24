import { Checkbox, Group, Text } from "@mantine/core";
import { CalendarView } from "../../pages/Calendar/CalendarView";

export interface TaskData {
  title: string;
  description: string;
  date?: Date;
  taskId: string;
}

interface TaskPillProps {
  data: TaskData;
  view: CalendarView;
  onTaskDone: (taskId: string) => void;
}

export const TaskPill = ({
  data: { title, description, date, taskId },
  view,
  onTaskDone,
}: TaskPillProps) => {
  return (
    <Group
      position="apart"
      noWrap
      sx={(theme) => ({
        backgroundColor: "white",
        color: theme.colors.gray[7],
        marginBottom: "20px",
        padding: "10px",
        borderRadius: "10px",
        cursor: "grab",
      })}
    >
      <Checkbox
        radius="xl"
        onChange={(event) => event.currentTarget.checked && onTaskDone(taskId)}
      />
      <Text weight={500}>{title}</Text>
      {view === "today" && <Text weight={300}>{description}</Text>}
      {view === "no-date" && <Text weight={300}>{description}</Text>}
    </Group>
  );
};
