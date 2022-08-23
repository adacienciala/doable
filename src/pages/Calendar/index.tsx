import { Button, Group, LoadingOverlay, Modal } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/errors";
import { APIClient, Method } from "../../api/task";
import { TaskData } from "../../components/TaskPill";
import { TaskEditDrawer } from "../../containers/TaskEditDrawer";
import { CalendarTab } from "./CalendarTab";

export type CalendarView = "today" | "week" | "no-date";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [taskEdited, setTaskEdited] = useState("");

  const {
    isLoading,
    isSuccess,
    error,
    data: tasks,
  } = useQuery(["tasks"], () => {
    return client.tasks(Method.GET);
  });

  const handleDrawerOpen = useCallback((taskId: string) => {
    setTaskEdited(taskId);
    setDrawerOpened(true);
  }, []);

  const handleDrawerClosed = useCallback(() => {
    setTaskEdited("");
    setDrawerOpened(false);
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
    tasks.forEach((task: TaskData) => (task.date = new Date(task.date)));
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
        <Group direction="column" align={"center"}>
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
        </Group>
      </Modal>
      <TaskEditDrawer
        opened={drawerOpened}
        onClose={handleDrawerClosed}
        taskId={taskEdited}
      />
      {tasks && (
        <Group
          direction="row"
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
              direction="row"
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
                onTaskClick={handleDrawerOpen}
              />
            </MotionGroup>
          ))}
        </Group>
      )}
    </>
  );
};

export default Calendar;
