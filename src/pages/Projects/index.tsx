import {
  Button,
  LoadingOverlay,
  Modal,
  SimpleGrid,
  Stack,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { AddButton } from "../../components/AddButton";
import { ProjectAddDrawer } from "../../containers/ProjectAddDrawer";
import { ProjectCard, ProjectData } from "../../containers/ProjectCard";

const Projects = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const [addProjectDrawerOpened, setAddProjectDrawerOpened] = useState(false);

  const {
    isLoading,
    error,
    data: projects,
  } = useQuery(["projects"], () => {
    return client.projects(Method.GET);
  });

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
      <ProjectAddDrawer
        opened={addProjectDrawerOpened}
        onClose={handleAddProjectDrawerClosed}
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
            <ProjectCard key={project.projectId} data={project} />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

export default Projects;
