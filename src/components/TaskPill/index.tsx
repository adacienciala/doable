import { Checkbox, Group, Text } from "@mantine/core";
import { hideNotification, showNotification } from "@mantine/notifications";
import { useState } from "react";
import { CalendarView } from "../../pages/Calendar/CalendarView";

export interface TaskData {
  title: string;
  description: string;
  date?: Date;
  taskId: string;
  projectId?: string;
}

interface TaskPillProps {
  data: TaskData;
  view: CalendarView;
  onTaskDone: (taskId: string) => void;
}

export const TaskPill = ({
  data: { title, description, taskId },
  view,
  onTaskDone,
}: TaskPillProps) => {
  const [checked, setChecked] = useState(false);
  const [clicked, setClicked] = useState(false);
  const shortenedTitle =
    title.length > 20 ? title.substring(0, 20) + "..." : title;

  const handleTaskDone = (taskId: string) => {
    const doneTimeout = setTimeout(() => onTaskDone(taskId), 3000);
    showNotification({
      id: `cancel-${taskId}`,
      autoClose: 3000,
      message: (
        <Group>
          {`Task "${shortenedTitle}" finished`}
          <Text
            span
            color="red"
            underline
            onClick={() => {
              clearTimeout(doneTimeout);
              setClicked(false);
              setChecked(false);
              hideNotification(`cancel-${taskId}`);
            }}
          >
            Undo
          </Text>
        </Group>
      ),
      loading: true,
    });
  };

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
        display: clicked ? "none" : "flex",
      })}
    >
      <Checkbox
        radius="xl"
        checked={checked}
        readOnly
        onClick={(e) => {
          setClicked(true);
          handleTaskDone(taskId);
        }}
        onMouseOver={(e) => setChecked(true)}
        onMouseOut={(e) => !clicked && setChecked(false)}
      />
      <Text weight={500}>{title}</Text>
      {view === "today" && <Text weight={300}>{description}</Text>}
      {view === "no-date" && <Text weight={300}>{description}</Text>}
    </Group>
  );
};
