import { Group } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useMemo } from "react";
import { CalendarView } from ".";
import { APIClient, Method } from "../../api/task";
import { ITask } from "../../models/task";
import { CalendarNoDate } from "./CalendarNoDate";
import { CalendarToday } from "./CalendarToday";
import { CalendarWeek } from "./CalendarWeek";
import { VerticalTab } from "./VerticalTab";

interface CalendarTabProps {
  title: string;
  range?: string;
  open: boolean;
  tasks: ITask[];
  view: CalendarView;
  changeViewHandler: any;
  onTaskClick: (taskId: string) => void;
}

export const CalendarTab = ({
  title,
  range,
  view,
  open,
  tasks,
  onTaskClick,
  changeViewHandler,
}: CalendarTabProps) => {
  const queryClient = useQueryClient();
  const client = new APIClient();

  const finishTaskMutation = useMutation(
    (taskId: string) =>
      client.singleTask(Method.PUT, taskId, {
        body: { isDone: true },
      }),
    {
      onSettled: (data) => {
        console.log("mutate > before invalid tasks");
        queryClient.invalidateQueries(["tasks"]);
        console.log("mutate > after invalid tasks");
        if (data.userUpdated) {
          console.log("mutate > before invalid user");
          queryClient.invalidateQueries(["user"]);
          console.log("mutate > after invalid user");
        }
      },
    }
  );

  console.log("rendering calendar tab");

  const CurrentCalendarView = useMemo(() => {
    switch (view) {
      case "today":
        return CalendarToday;
      case "week":
        return CalendarWeek;
      case "no-date":
        return CalendarNoDate;
    }
  }, [view]);

  const handleTaskDone = useCallback(
    (taskId: string) => {
      console.log("before mutate");
      finishTaskMutation.mutate(taskId);
      console.log("after mutate");
    },
    [finishTaskMutation]
  );

  const MotionGroup = motion(Group);

  return (
    <MotionGroup
      direction="row"
      style={{
        alignItems: "stretch",
        flexGrow: open ? 1 : 0,
        flexWrap: "nowrap",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        ease: "easeOut",
        duration: 1,
      }}
    >
      <VerticalTab
        title={title}
        range={range}
        handleClick={changeViewHandler}
      />
      <AnimatePresence>
        {open && (
          <div
            style={{
              width: "100%",
              borderRight: "1px solid gray",
              padding: "20px",
            }}
          >
            {
              <CurrentCalendarView
                tasks={tasks}
                onTaskDone={handleTaskDone}
                onTaskClick={onTaskClick}
              />
            }
          </div>
        )}
      </AnimatePresence>
    </MotionGroup>
  );
};
