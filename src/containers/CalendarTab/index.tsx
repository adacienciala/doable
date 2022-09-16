import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction, useContext, useMemo } from "react";
import { APIClient, Method, TaskExtended } from "../../api/client";
import { VerticalTab } from "../../components/VerticalTab";
import {
  CalendarNoDate,
  CalendarToday,
  CalendarView,
  CalendarWeek,
} from "../../pages/Calendar/CalendarView";
import { CalendarBacklog } from "../../pages/Dashboard/CalendarBacklog";
import { HeaderContext } from "../../utils/headerContext";

interface CalendarTabProps {
  title: string;
  range?: { start: Date; end: Date; setStart?: Dispatch<SetStateAction<Date>> };
  open: boolean;
  tasks: TaskExtended[];
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
  const [, setHeaderText] = useContext(HeaderContext);

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
    setHeaderText("Great job");
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
      case "backlog":
        return { ViewComponent: CalendarBacklog };
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
