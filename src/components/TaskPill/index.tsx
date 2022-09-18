import { Box, Checkbox, Group, Indicator, Text } from "@mantine/core";
import { hideNotification, showNotification } from "@mantine/notifications";
import { format, isBefore } from "date-fns";
import { useState } from "react";
import { TaskExtended } from "../../api/client";
import { CalendarView } from "../../pages/Calendar/CalendarView";
import { isValidDate, shortenText } from "../../utils/utils";

export interface TaskData {
  title: string;
  description: string;
  difficulty: string;
  date?: Date;
  taskId: string;
  projectId?: string;
}

interface TaskPillProps {
  data: TaskExtended;
  view: CalendarView;
  handleTaskDone: (taskId: string) => void;
  handleTaskOnFinish?: () => void;
}

export const TaskPill = ({
  data: { title, description, taskId, projectDetails, date },
  view,
  handleTaskDone,
  handleTaskOnFinish,
}: TaskPillProps) => {
  const [checked, setChecked] = useState(false);
  const [clicked, setClicked] = useState(false);

  const isTutorialTask = taskId === localStorage.getItem("tutorialTaskId");

  const onTaskDone = (taskId: string) => {
    if (handleTaskOnFinish) handleTaskOnFinish();
    const doneTimeout = setTimeout(() => handleTaskDone(taskId), 2000);
    showNotification({
      id: `cancel-${taskId}`,
      autoClose: 2000,
      message: (
        <Group>
          {`Task "${shortenText(title, 20)}" is being finished...`}
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
            Cancel
          </Text>
        </Group>
      ),
      loading: true,
    });
  };

  return (
    <Indicator
      position="top-end"
      disabled={projectDetails.length === 0}
      label={
        projectDetails.length && (
          <Box
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {projectDetails[0].name}
          </Box>
        )
      }
      size={18}
      styles={(theme) => ({
        indicator: {
          maxWidth: "30%",
          color: "black",
          transform: "translate(0px, -50%) !important",
        },
      })}
      {...(isTutorialTask ? { "data-tut": "created-task" } : {})}
    >
      <Group
        noWrap
        sx={(theme) => ({
          backgroundColor: "white",
          color: theme.colors.gray[7],
          marginTop: "15px",
          padding: "10px",
          borderRadius: "10px",
          cursor: "grab",
          gap: "3%",
          display: clicked ? "none" : "flex",
        })}
      >
        <Checkbox
          radius="xl"
          checked={checked}
          readOnly
          onClick={(e) => {
            setClicked(true);
            onTaskDone(taskId);
          }}
          onMouseOver={(e) => setChecked(true)}
          onMouseOut={(e) => !clicked && setChecked(false)}
          {...(isTutorialTask ? { "data-tut": "finish-task" } : {})}
        />
        <Text weight={500} style={{ minWidth: "30%" }}>
          {title}
        </Text>
        {view === "today" && <Text weight={300}>{description}</Text>}
        {view === "no-date" && <Text weight={300}>{description}</Text>}
        {view !== "week" &&
          (isValidDate(date) ? (
            <Text
              weight={300}
              color={
                isBefore(
                  date.setHours(0, 0, 0, 0),
                  new Date().setHours(0, 0, 0, 0)
                )
                  ? "red"
                  : undefined
              }
              style={{ marginLeft: "auto" }}
            >
              {format(date, "dd/MM/yyyy")}
            </Text>
          ) : (
            <Box style={{ width: "40px" }} />
          ))}
      </Group>
    </Indicator>
  );
};
