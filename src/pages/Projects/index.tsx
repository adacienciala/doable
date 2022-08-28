import {
  Button,
  Center,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MouseEvent, useCallback, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { AddButton } from "../../components/AddButton";
import { ProjectAddDrawer } from "../../containers/ProjectAddDrawer";
import { ProjectCard, ProjectData } from "../../containers/ProjectCard";
import { ProjectEditDrawer } from "../../containers/ProjectEditDrawer";

const Projects = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [projectMutated, setProjectMutated] = useState("");
  const [addProjectDrawerOpened, setAddProjectDrawerOpened] = useState(false);
  const [editProjectDrawerOpened, setEditProjectDrawerOpened] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    isLoading,
    error,
    data: projects,
  } = useQuery(["projects"], () => {
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
        <SimpleGrid
          cols={3}
          style={{
            margin: "20px",
          }}
        >
          <AddButton
            sx={() => ({
              placeSelf: "center",
            })}
            size="xl"
            onClick={(e) => handleAddProjectDrawerOpen()}
          />
          {projects.map((project: ProjectData) => (
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
        </SimpleGrid>
      )}
    </>
  );
};

export default Projects;
