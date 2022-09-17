import {
  Button,
  Card,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  Space,
  Text,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { RiAddFill } from "react-icons/ri";
import { Navigate, useLocation } from "react-router-dom";
import { APIClient, Method, ProjectExtended } from "../../api/client";
import { ApiError } from "../../api/errors";
import { ProjectAddDrawer } from "../../containers/ProjectAddDrawer";
import {
  ProjectCard,
  projectCardStyles,
  sizeOptions,
} from "../../containers/ProjectCard";
import { ProjectEditDrawer } from "../../containers/ProjectEditDrawer";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { HeaderContext } from "../../utils/headerContext";

const Projects = () => {
  const location = useLocation() as any;
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [projectMutated, setProjectMutated] = useState("");
  const [addProjectDrawerOpened, setAddProjectDrawerOpened] = useState(false);
  const [editProjectDrawerOpened, setEditProjectDrawerOpened] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { classes } = projectCardStyles();
  const [, setHeaderText] = useContext(HeaderContext);

  const {
    isLoading,
    error,
    data: projects,
  } = useQuery<ProjectExtended[]>(["projects"], () => {
    return client.projects(Method.GET);
  });

  const deleteProjectMutation = useMutation(
    () => client.singleProject(Method.DELETE, projectMutated),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
      },
    }
  );

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

  const handleAddProjectDrawerOpen = useCallback(() => {
    setAddProjectDrawerOpened(true);
  }, []);

  const handleAddProjectDrawerClosed = useCallback(() => {
    setAddProjectDrawerOpened(false);
  }, []);

  const handleEditProjectDrawerOpen = useCallback((projectId: string) => {
    setProjectMutated(projectId ?? "");
    setEditProjectDrawerOpened(true);
  }, []);

  const handleEditProjectDrawerClosed = useCallback(() => {
    setProjectMutated("");
    setEditProjectDrawerOpened(false);
  }, []);

  const handleDeleteProjectModalOpen = useCallback((projectId: string) => {
    setProjectMutated(projectId);
    setOpenDeleteModal(true);
  }, []);

  const handleDeleteProjectModalClosed = useCallback(() => {
    setProjectMutated("");
    setOpenDeleteModal(false);
  }, []);

  function handleDeleteProject(event: MouseEvent<HTMLElement>) {
    deleteProjectMutation.mutate();
    setProjectMutated("");
    setOpenDeleteModal(false);
  }

  useEffect(() => {
    setHeaderText("Good organizing");
  }, [setHeaderText]);

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
      <Modal
        centered
        opened={openDeleteModal}
        onClose={handleDeleteProjectModalClosed}
        title="Delete project"
      >
        <Text size="sm">
          Are you sure you want to delete this project? All linked tasks will be
          deleted. This action is irreversible.
        </Text>
        <Center style={{ height: "70px" }}>
          <Button
            variant="light"
            color={"gray"}
            onClick={handleDeleteProjectModalClosed}
          >
            Cancel
          </Button>
          <Space w="md" />
          <Button variant="outline" color={"red"} onClick={handleDeleteProject}>
            Delete project
          </Button>
        </Center>
      </Modal>
      <ProjectAddDrawer
        opened={addProjectDrawerOpened}
        onClose={handleAddProjectDrawerClosed}
      />
      <ProjectEditDrawer
        projectId={projectMutated}
        opened={editProjectDrawerOpened}
        onClose={handleEditProjectDrawerClosed}
      />
      {projects && (
        <Group
          align="stretch"
          style={{
            margin: "20px",
          }}
        >
          <Card
            component="button"
            onClick={() => handleAddProjectDrawerOpen()}
            withBorder
            shadow="sm"
            radius="md"
            sx={() => ({ ...sizeOptions["xl"].card })}
            className={classes.card}
          >
            <RiAddFill size={50} />
          </Card>

          {projects.map((project: ProjectExtended) => (
            <ProjectCard
              onEditProject={() =>
                handleEditProjectDrawerOpen(project.projectId)
              }
              onDeleteProject={() =>
                handleDeleteProjectModalOpen(project.projectId)
              }
              key={project.projectId}
              data={project}
            />
          ))}
        </Group>
      )}
    </>
  );
};

export default Projects;
