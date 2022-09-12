import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method, TaskExtended } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Scoreboard } from "../../components/Scoreboard";
import { TaskData } from "../../components/TaskPill";
import { TaskAddDrawer } from "../../containers/TaskAddDrawer";
import { TaskEditDrawer } from "../../containers/TaskEditDrawer";
import { IUser } from "../../models/user";
import { HeaderContext } from "../../utils/context";
import { CalendarBacklog } from "./CalendarBacklog";

const Dashboard = () => {
  const [, setHeaderText] = useContext(HeaderContext);
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [editTaskDrawerOpened, setEditTaskDrawerOpened] = useState(false);
  const [taskEdited, setTaskEdited] = useState("");
  const [addTaskDrawerOpened, setAddTaskDrawerOpened] = useState(false);
  const [addTaskData, setAddTaskData] = useState<Partial<TaskData>>({});

  const {
    isLoading,
    error,
    data: users,
  } = useQuery<IUser[]>(["users"], () => client.users(Method.GET));

  const {
    isSuccess,
    isLoading: isLoadingTasks,
    error: errorTasks,
    data: tasks,
  } = useQuery<TaskExtended[]>(["tasks"], () => client.tasks(Method.GET));

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

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

  useEffect(() => {
    setHeaderText("Lets look at what we have here");
  }, [setHeaderText]);

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

  if (error || errorTasks) {
    const errObj = new ApiError(error ?? errorTasks);
    if (errObj.code === 404) {
      return <Navigate to="/404" state={{ from: location, errorMsg: error }} />;
    }
    if (errObj.code === 500) {
      return <Navigate to="/500" state={{ from: location, errorMsg: error }} />;
    }
  }

  if (isSuccess) {
    tasks.forEach((task: TaskData) => {
      if (task.date) {
        task.date = new Date(task.date);
      }
    });
  }

  return (
    <>
      <LoadingOverlay
        visible={isLoading || isLoadingTasks}
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
      <Group
        position="apart"
        align="stretch"
        grow
        style={{
          gap: "40px",
          padding: "20px",
          height: "100%",
        }}
      >
        {tasks && (
          <CalendarBacklog
            tasks={tasks}
            onTaskDone={handleTaskDone}
            onTaskClick={handleEditTaskDrawerOpen}
            onAddTask={handleAddTaskDrawerOpen}
          />
        )}
        <Scoreboard users={users ?? []} style={{ flexGrow: 1.5 }} />
      </Group>
    </>
  );
};

export default Dashboard;
