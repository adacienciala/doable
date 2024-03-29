import { ActionIcon, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { RiArrowLeftFill } from "react-icons/ri";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { APIClient, Method, TaskExtended } from "../../../api/client";
import { ApiError } from "../../../api/errors";
import { AddButton } from "../../../components/AddButton";
import { TaskData } from "../../../components/TaskPill";
import { TaskAddDrawer } from "../../../containers/TaskAddDrawer";
import { TaskEditDrawer } from "../../../containers/TaskEditDrawer";
import { TaskList } from "../../../containers/TaskList";
import { AccessDeniedModal } from "../../../layouts/AccessDeniedModal";

const ProjectPage = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const { projectId } = useParams();
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [editTaskDrawerOpened, setEditTaskDrawerOpened] = useState(false);
  const [taskEdited, setTaskEdited] = useState("");
  const [addTaskDrawerOpened, setAddTaskDrawerOpened] = useState(false);
  const [addTaskData, setAddTaskData] = useState<Partial<TaskData>>({});

  const {
    isLoading,
    error,
    data: project,
  } = useQuery(["project", projectId], () => {
    return client.singleProject(Method.GET, projectId!);
  });

  const { data: tasks } = useQuery(["tasks"], async () => {
    const allTasks = await client.tasks(Method.GET);
    allTasks.forEach((t: TaskExtended) => (t.date = new Date(t.date)));
    return allTasks.filter((t: TaskExtended) => t.projectId === projectId);
  });

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
          queryClient.invalidateQueries(["users"]);
        }
      },
    }
  );

  const onTaskDone = (taskId: string) => {
    finishTaskMutation.mutate(taskId);
  };

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
      {project && (
        <Stack sx={{ padding: "20px", height: "100%" }}>
          <Group>
            <ActionIcon
              variant="transparent"
              onClick={() => navigate(-1)}
              size="md"
            >
              <RiArrowLeftFill size={25} />
            </ActionIcon>
            <Text weight={"bold"}>{project.name}</Text>
            <AddButton
              sx={() => ({
                marginLeft: "auto",
              })}
              onClick={() => handleAddTaskDrawerOpen({ projectId })}
            />
          </Group>
          <TaskList
            tasks={tasks}
            view="no-date"
            onTaskClick={handleEditTaskDrawerOpen}
            handleTaskDone={onTaskDone}
          />
        </Stack>
      )}
    </>
  );
};

export default ProjectPage;
