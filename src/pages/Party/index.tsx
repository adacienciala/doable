import {
  Button,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MouseEvent, useCallback, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Chat } from "../../containers/Chat";
import { ProjectCard } from "../../containers/ProjectCard";
import { ProjectEditDrawer } from "../../containers/ProjectEditDrawer";
import { IProject } from "../../models/project";
import { IUser } from "../../models/user";
import NoParty from "./NoParty";
import { PartyMemberProfile } from "./PartyMemberProfile";

const Party = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const [partyId, setPartyId] = useState(localStorage.getItem("partyId") ?? "");
  const [projectMutated, setProjectMutated] = useState("");
  const [editProjectDrawerOpened, setEditProjectDrawerOpened] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();

  const {
    isLoading,
    isSuccess,
    error,
    data: party,
  } = useQuery(
    ["party", partyId],
    () => {
      return client.singleParty(Method.GET, partyId);
    },
    {
      enabled: partyId !== "",
    }
  );

  const deleteProjectMutation = useMutation(
    () => client.singleProject(Method.DELETE, projectMutated),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["party"]);
      },
    }
  );

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

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

  if (!partyId) {
    return <NoParty onJoinParty={setPartyId} />;
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
      <ProjectEditDrawer
        projectId={projectMutated}
        opened={editProjectDrawerOpened}
        onClose={handleEditProjectDrawerClosed}
      />
      {isSuccess && (
        <Stack
          style={{
            padding: "20px",
            height: "calc(100% - 40px)",
          }}
          spacing={20}
        >
          <Stack>
            <Text size="xl" weight="bold">
              Members
            </Text>
            <ScrollArea>
              <Group noWrap style={{ marginBottom: "40px" }}>
                {party.members.map((member: IUser, idx: number) => (
                  <PartyMemberProfile key={idx} user={member} />
                ))}
              </Group>
            </ScrollArea>
          </Stack>

          <Group align="flex-start" position="apart" noWrap>
            <Stack>
              <Text size="xl" weight="bold">
                Quests
              </Text>
              {party.quests &&
                party.quests.map((project: IProject) => (
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
            </Stack>
            <Chat users={party.members} />
          </Group>
        </Stack>
      )}
    </>
  );
};

export default Party;
