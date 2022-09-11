import {
  ActionIcon,
  Button,
  Card,
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
import { MouseEvent, useCallback, useContext, useState } from "react";
import { RiAddFill, RiSettings2Line } from "react-icons/ri";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method, PartyExtended } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Chat } from "../../containers/Chat";
import { PartyEditDrawer } from "../../containers/PartyEditDrawer";
import { ProjectAddDrawer } from "../../containers/ProjectAddDrawer";
import { ProjectCard, projectCardStyles } from "../../containers/ProjectCard";
import { ProjectEditDrawer } from "../../containers/ProjectEditDrawer";
import { IUser } from "../../models/user";
import { HeaderContext } from "../../utils/context";
import NoParty from "./NoParty";
import { PartyMemberProfile } from "./PartyMemberProfile";

const Party = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const [partyId, setPartyId] = useState(localStorage.getItem("partyId") ?? "");
  const [projectMutated, setProjectMutated] = useState("");
  const [addProjectDrawerOpened, setAddProjectDrawerOpened] = useState(false);
  const [editProjectDrawerOpened, setEditProjectDrawerOpened] = useState(false);
  const [editPartyDrawerOpened, setEditPartyDrawerOpened] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { classes } = projectCardStyles();
  const [_, setHeaderText] = useContext(HeaderContext);

  const {
    isLoading,
    isSuccess,
    error,
    data: party,
  } = useQuery<PartyExtended>(
    ["party", partyId],
    () => client.singleParty(Method.GET, partyId),
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

  const handleEditPartyDrawerOpen = useCallback(() => {
    setEditPartyDrawerOpened(true);
  }, []);

  const handleEditPartyDrawerClosed = useCallback(() => {
    setEditPartyDrawerOpened(false);
  }, []);

  const handleLeaveParty = useCallback(() => {
    setEditPartyDrawerOpened(false);
    setPartyId("");
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

  if (isSuccess) {
    setHeaderText("Don't let them slack off");
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
      <ProjectAddDrawer
        data={{ party: [partyId] }}
        opened={addProjectDrawerOpened}
        onClose={handleAddProjectDrawerClosed}
      />
      <PartyEditDrawer
        party={party}
        opened={editPartyDrawerOpened}
        onClose={handleEditPartyDrawerClosed}
        onLeave={handleLeaveParty}
        onDelete={handleLeaveParty}
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
            <Group>
              <Text size="xl" weight="bold">
                Members
              </Text>
              <ActionIcon
                variant="transparent"
                onClick={handleEditPartyDrawerOpen}
                size="sm"
                sx={() => ({
                  marginLeft: "auto",
                })}
              >
                <RiSettings2Line size={25} />
              </ActionIcon>
            </Group>

            <ScrollArea>
              <Group noWrap style={{ marginBottom: "40px" }}>
                {party.members.map((member: IUser, idx: number) => (
                  <PartyMemberProfile key={idx} user={member} />
                ))}
              </Group>
            </ScrollArea>
          </Stack>

          <Group
            align="stretch"
            position="apart"
            noWrap
            style={{ maxHeight: "calc(100% - 300px)" }}
          >
            <Stack>
              <Text size="xl" weight="bold">
                Quests
              </Text>

              <ScrollArea>
                <Group align="stretch">
                  <Card
                    component="button"
                    onClick={() => handleAddProjectDrawerOpen()}
                    withBorder
                    shadow="sm"
                    radius="md"
                    sx={() => ({ height: "220px" })}
                    className={classes.card}
                  >
                    <RiAddFill size={50} />
                  </Card>
                  {party.quests &&
                    party.quests.map((project) => (
                      <ProjectCard
                        size="lg"
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
              </ScrollArea>
            </Stack>
            <Chat
              sx={{ minWidth: "400px", width: "400px" }}
              users={party.members}
            />
          </Group>
        </Stack>
      )}
    </>
  );
};

export default Party;
