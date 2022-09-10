import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction, useMemo } from "react";
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
  range?: { start: Date; end: Date; setStart?: Dispatch<SetStateAction<Date>> };
  open: boolean;
  tasks: ITask[];
  view: CalendarView;
  changeViewHandler: any;
  onTaskClick: (taskId: string) => void;
  onAddTask: (data?: { date?: Date; projectId?: string }) => void;
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
        return { ViewComponent: CalendarToday };
      case "week":
        return {
          ViewComponent: CalendarWeek,
          options: {
            start: range?.start,
            end: range?.end,
            setFirstDay: range?.setStart,
          },
        };
      case "no-date":
        return { ViewComponent: CalendarNoDate };
    }
  }, [view, range]);

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
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <CurrentCalendarView.ViewComponent
              tasks={tasks}
              onTaskDone={handleTaskDone}
              onTaskClick={onTaskClick}
              onAddTask={onAddTask}
              options={CurrentCalendarView.options}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
