import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
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
        queryClient.invalidateQueries(["tasks"]);
        if (data.userUpdated) {
          queryClient.invalidateQueries(["user"]);
        }
      },
    }
  );

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

  const handleTaskDone = (taskId: string) => {
    finishTaskMutation.mutate(taskId);
  };

  return (
    <>
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
            <CurrentCalendarView
              tasks={tasks}
              onTaskDone={handleTaskDone}
              onTaskClick={onTaskClick}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
