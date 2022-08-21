import { Button, Group, LoadingOverlay, Modal } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useCallback, useMemo, useState } from "react";
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

  const calendarTabs = useMemo(
    () => (
      <>
        <CalendarTab
          title="Today"
          range={format(Date.now(), "dd/MM/yyyy")}
          view={view}
          tasks={tasks}
          changeViewHandler={() => setView("today")}
          open={view === "today"}
          onTaskClick={handleDrawerOpen}
        />
        <CalendarTab
          title="Week"
          range={`${format(
            startOfWeek(Date.now(), { weekStartsOn: 1 }),
            "dd/MM/yyyy"
          )} - ${format(
            endOfWeek(Date.now(), { weekStartsOn: 1 }),
            "dd/MM/yyyy"
          )}`}
          view={view}
          tasks={tasks}
          changeViewHandler={() => setView("week")}
          open={view === "week"}
          onTaskClick={handleDrawerOpen}
        />
        <CalendarTab
          title="Not scheduled"
          view={view}
          tasks={tasks}
          changeViewHandler={() => setView("no-date")}
          open={view === "no-date"}
          onTaskClick={handleDrawerOpen}
        />
      </>
    ),
    [view, tasks, setView, handleDrawerOpen]
  );

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
  console.log("rendering calendar");

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
          {calendarTabs}
        </Group>
      )}
    </>
  );
};

export default Calendar;
