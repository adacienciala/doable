import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { APIClient, Method } from "../../api/client";
import { VerticalTab } from "../../components/VerticalTab";
import { ITask } from "../../models/task";
import {
  CalendarNoDate,
  CalendarToday,
  CalendarView,
  CalendarWeek,
} from "../../pages/Calendar/CalendarView";

interface CalendarTabProps {
  title: string;
  range?: string;
  open: boolean;
  tasks: ITask[];
  view: CalendarView;
  changeViewHandler: any;
  onTaskClick: (taskId: string) => void;
  onAddTask: (date?: Date) => void;
}

export const CalendarTab = ({
  title,
  range,
  view,
  open,
  tasks,
  onTaskClick,
  onAddTask,
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

  const handleTaskDone = (taskId: string) => {
    finishTaskMutation.mutate(taskId);
  };

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
              onAddTask={onAddTask}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
