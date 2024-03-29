import { Group, LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { APIClient, Method, TaskExtended } from "../../api/client";
import { ApiError } from "../../api/errors";
import { TaskData } from "../../components/TaskPill";
import { CalendarTab } from "../../containers/CalendarTab";
import { TaskAddDrawer } from "../../containers/TaskAddDrawer";
import { TaskEditDrawer } from "../../containers/TaskEditDrawer";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { HeaderContext } from "../../utils/headerContext";
import { CalendarView } from "./CalendarView";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");
  const [rangeStart, setRangeStart] = useState(new Date());
  const location = useLocation() as any;
  const client = new APIClient();
  const [editTaskDrawerOpened, setEditTaskDrawerOpened] = useState(false);
  const [taskEdited, setTaskEdited] = useState("");
  const [addTaskDrawerOpened, setAddTaskDrawerOpened] = useState(false);
  const [addTaskData, setAddTaskData] = useState<Partial<TaskData>>({});
  const [, setHeaderText] = useContext(HeaderContext);

  const {
    isLoading,
    isSuccess,
    error,
    data: tasks,
  } = useQuery<TaskExtended[]>(["tasks"], () => {
    return client.tasks(Method.GET);
  });

  const handleEditTaskDrawerOpen = useCallback((taskId: string) => {
    setTaskEdited(taskId ?? "");
    setEditTaskDrawerOpened(true);
  }, []);

  const handleEditTaskDrawerClosed = useCallback(() => {
    setTaskEdited("");
    setEditTaskDrawerOpened(false);
  }, []);

  const handleAddTaskDrawerOpen = useCallback(
    (data: Partial<TaskData> = {}) => {
      setAddTaskData(data);
      setAddTaskDrawerOpened(true);
    },
    []
  );

  const handleAddTaskDrawerClosed = useCallback(() => {
    setAddTaskData({});
    setAddTaskDrawerOpened(false);
  }, []);

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

  const MotionGroup = motion(Group);

  const calendarTabsOptions: {
    title: string;
    view: CalendarView;
    range?: {
      start: Date;
      end: Date;
      setStart?: Dispatch<SetStateAction<Date>>;
    };
  }[] = [
    {
      title: "Today",
      view: "today",
      range: {
        start: new Date(),
        end: new Date(),
      },
    },
    {
      title: "Week",
      view: "week",
      range: {
        start: startOfWeek(rangeStart, { weekStartsOn: 1 }),
        end: endOfWeek(endOfWeek(rangeStart, { weekStartsOn: 1 }), {
          weekStartsOn: 1,
        }),
        setStart: setRangeStart,
      },
    },
    { title: "Not scheduled", view: "no-date" },
  ];

  useEffect(() => {
    if (tasks) {
      if (tasks.length < 5) {
        setHeaderText("Not that bad");
      } else if (tasks.length < 10) {
        setHeaderText("Take care of that backlog");
      } else {
        setHeaderText("You can do this, I believe in you,");
      }
    }
  }, [tasks, setHeaderText]);

  if (isSuccess) {
    tasks.forEach((task: TaskData) => {
      if (task.date) {
        task.date = new Date(task.date);
      }
    });
  }

  if (error) {
    const errObj = new ApiError(error);
    if (errObj.code === 404) {
      return <Navigate to="/404" state={{ from: location, errorMsg: error }} />;
    }
    if (errObj.code === 500) {
      return <Navigate to="/500" state={{ from: location, errorMsg: error }} />;
    }
  }

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        overlayOpacity={0.8}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />
      <AccessDeniedModal visible={isAccessError()} />
      <TaskEditDrawer
        taskId={taskEdited}
        opened={editTaskDrawerOpened}
        onClose={handleEditTaskDrawerClosed}
      />
      <TaskAddDrawer
        data={addTaskData}
        opened={addTaskDrawerOpened}
        onClose={handleAddTaskDrawerClosed}
      />
      {tasks && (
        <Group
          align={"stretch"}
          style={{
            height: "100%",
            gap: 0,
          }}
          noWrap
        >
          {calendarTabsOptions.map((options) => (
            <MotionGroup
              key={options.view}
              style={{
                alignItems: "stretch",
                flexGrow: view === options.view ? 1 : 0,
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
              <CalendarTab
                title={options.title}
                range={options.range}
                view={view}
                tasks={tasks}
                changeViewHandler={() => setView(options.view)}
                open={view === options.view}
                onTaskClick={handleEditTaskDrawerOpen}
                onAddTask={handleAddTaskDrawerOpen}
              />
            </MotionGroup>
          ))}
        </Group>
      )}
    </>
  );
};

export default Calendar;
