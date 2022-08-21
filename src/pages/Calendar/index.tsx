import { Button, Group, LoadingOverlay, Modal, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/errors";
import { APIClient, Method } from "../../api/task";
import { UserContext } from "../../App";
import { TaskData } from "../../components/TaskPill";
import { TaskEditDrawer } from "../../containers/TaskEditDrawer";
import { CalendarNoDate } from "./CalendarNoDate";
import { CalendarToday } from "./CalendarToday";
import { CalendarWeek } from "./CalendarWeek";

export type CalendarView = "today" | "week" | "no-date";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const { user, setUser } = useContext(UserContext);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [taskEdited, setTaskEdited] = useState("");

  const {
    isLoading,
    isSuccess,
    error,
    data: tasks,
    refetch,
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

  interface VerticalTabProps {
    title: string;
    range?: string;
    view: CalendarView;
  }

  const VerticalTab = ({ title, range, view }: VerticalTabProps) => {
    return (
      <Group
        sx={() => ({
          padding: "10px 40px",
          width: "80px",
          flexDirection: "row",
          gap: "20px",
          borderRight: "1px solid gray",
          whiteSpace: "nowrap",
          alignItems: "flex-start",
          overflow: "visible",
          ":hover": {
            cursor: "pointer",
            backgroundColor: "gray",
          },
        })}
        onClick={() => setView(view)}
      >
        <Group
          style={{
            transformOrigin: "left center",
            flexWrap: "nowrap",
            transform: "rotate(90deg)",
            fontWeight: "bold",
          }}
        >
          <Text>{title}</Text>
          {range && <Text>{range}</Text>}
        </Group>
      </Group>
    );
  };

  interface CalendarTabProps {
    title: string;
    range?: string;
    tabView: CalendarView;
    onTaskClick: (taskId: string) => void;
  }

  const CalendarTab = ({
    title,
    range,
    tabView,
    onTaskClick,
  }: CalendarTabProps) => {
    const open = view === tabView;

    const handleTaskDone = useCallback(async (taskId: string) => {
      const { userUpdated } = await client.singleTask(Method.PUT, taskId, {
        body: { isDone: true },
      });
      if (!userUpdated) return;
      const newUser = await client.singleUser(Method.GET, user?.doableId!);
      setUser(newUser);
      refetch();
    }, []);

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
        <VerticalTab title={title} range={range} view={tabView} />
        <AnimatePresence>
          {open && (
            <div
              style={{
                width: "100%",
                borderRight: "1px solid gray",
                padding: "20px",
              }}
            >
              {view === "today" && (
                <CalendarToday
                  tasks={tasks}
                  onTaskDone={handleTaskDone}
                  onTaskClick={onTaskClick}
                />
              )}
              {view === "week" && (
                <CalendarWeek
                  tasks={tasks}
                  onTaskDone={handleTaskDone}
                  onTaskClick={onTaskClick}
                />
              )}
              {view === "no-date" && (
                <CalendarNoDate
                  tasks={tasks}
                  onTaskDone={handleTaskDone}
                  onTaskClick={onTaskClick}
                />
              )}
            </div>
          )}
        </AnimatePresence>
      </MotionGroup>
    );
  };

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
          <CalendarTab
            title="Today"
            range={format(Date.now(), "dd/MM/yyyy")}
            tabView="today"
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
            tabView="week"
            onTaskClick={handleDrawerOpen}
          />
          <CalendarTab
            title="Not scheduled"
            tabView="no-date"
            onTaskClick={handleDrawerOpen}
          />
        </Group>
      )}
    </>
  );
};

export default Calendar;
