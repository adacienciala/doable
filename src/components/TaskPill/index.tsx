import { Checkbox, Group, Text } from "@mantine/core";
import { MouseEvent, useCallback } from "react";
import { CalendarView } from "../../pages/Calendar";
import { isCheckbox } from "../../utils/utils";

export interface TaskData {
  title: string;
  description: string;
  date: Date;
  taskId: string;
}

interface TaskPillProps {
  data: TaskData;
  view: CalendarView;
  onTaskDone: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
}

export const TaskPill = ({
  data: { title, description, date, taskId },
  view,
  onTaskDone,
  onTaskClick,
}: TaskPillProps) => {
  const handleTaskClick = useCallback(
    async (event: MouseEvent<HTMLDivElement>) => {
      if (event.target instanceof Element && !isCheckbox(event.target)) {
        onTaskClick(taskId);
      }
    },
    [onTaskClick, taskId]
  );

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
      onClick={handleTaskClick}
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
