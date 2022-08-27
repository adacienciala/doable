import {
  ActionIcon,
  Box,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { RiArrowLeftFill } from "react-icons/ri";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { APIClient, Method } from "../../../api/client";
import { ApiError } from "../../../api/errors";
import { AddButton } from "../../../components/AddButton";
import { TaskList } from "../../../containers/TaskList";
import { ITask } from "../../../models/task";

const ProjectPage = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const { projectId } = useParams();
  const client = new APIClient();

  const {
    isLoading,
    error,
    data: project,
  } = useQuery(["project", projectId], () => {
    return client.singleProject(Method.GET, projectId!);
  });

  const { data: tasks } = useQuery(["tasks"], () => {
    return client.tasks(Method.GET);
  });

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

  // TODO: Add operations on tasks in project's view
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
      {project && (
        <Box sx={{ margin: "20px" }}>
          <Group
            sx={() => ({
              marginBottom: "20px",
            })}
          >
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
              onClick={() => console.log("tak tak dodajemy tak")}
            />
          </Group>

          {tasks && (
            <TaskList
              tasks={tasks.filter((t: ITask) => t.projectId === projectId)}
              view="no-date"
              onTaskDone={() => console.log("tak tak zrobilismy tak")}
              onTaskClick={() => console.log("tak tak edytujemy tak")}
            />
          )}
        </Box>
      )}
    </>
  );
};

export default ProjectPage;
