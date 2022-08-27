import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { TaskData } from "../../components/TaskPill";
import { CalendarTab } from "../../containers/CalendarTab";
import { TaskAddDrawer } from "../../containers/TaskAddDrawer";
import { TaskEditDrawer } from "../../containers/TaskEditDrawer";
import { ITask } from "../../models/task";
import { CalendarView } from "./CalendarView";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const [editTaskDrawerOpened, setEditTaskDrawerOpened] = useState(false);
  const [taskEdited, setTaskEdited] = useState("");
  const [addTaskDrawerOpened, setAddTaskDrawerOpened] = useState(false);
  const [addTaskData, setAddTaskData] = useState<Partial<TaskData>>({});

  const {
    isLoading,
    isSuccess,
    error,
    data: tasks,
  } = useQuery<ITask[]>(["tasks"], () => {
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

  const handleAddTaskDrawerOpen = useCallback((date?: Date) => {
    setAddTaskData({ date });
    setAddTaskDrawerOpened(true);
  }, []);

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
    range?: string;
  }[] = [
    { title: "Today", view: "today", range: format(Date.now(), "dd/MM/yyyy") },
    {
      title: "Week",
      view: "week",
      range: `${format(
        startOfWeek(Date.now(), { weekStartsOn: 1 }),
        "dd/MM/yyyy"
      )} - ${format(endOfWeek(Date.now(), { weekStartsOn: 1 }), "dd/MM/yyyy")}`,
    },
    { title: "Not scheduled", view: "no-date" },
  ];

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
      <Modal
        centered
        overlayBlur={3}
        transition="fade"
        transitionDuration={600}
        onClose={() => {
          localStorage.clear();
          navigate("/auth", { state: { from: location }, replace: false });
        }}
        opened={isAccessError()}
        withCloseButton={false}
      >
        <Stack align={"center"}>
          You no longer have access to this page.
          <Button
            variant="subtle"
            onClick={() => {
              localStorage.clear();
              navigate("/auth", { state: { from: location }, replace: false });
            }}
          >
            Log In
          </Button>
        </Stack>
      </Modal>
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
