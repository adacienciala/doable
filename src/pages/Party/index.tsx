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
  useMantineTheme,
} from "@mantine/core";
import { cleanNotifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RiAddFill, RiSettings2Line } from "react-icons/ri";
import ReactJoyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  StoreHelpers,
} from "react-joyride";
import { Navigate, useLocation } from "react-router-dom";
import { APIClient, Method, PartyExtended } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Chat } from "../../containers/Chat";
import { PartyEditDrawer } from "../../containers/PartyEditDrawer";
import { ProjectAddDrawer } from "../../containers/ProjectAddDrawer";
import {
  ProjectCard,
  projectCardStyles,
  sizeOptions,
} from "../../containers/ProjectCard";
import { ProjectEditDrawer } from "../../containers/ProjectEditDrawer";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { IUser } from "../../models/user";
import { HeaderContext } from "../../utils/headerContext";
import {
  JoyrideStateProps,
  joyrideStyles,
  TourPageProps,
  tutorialSteps,
} from "../../utils/joyride";
import NoParty from "./NoParty";
import { PartyMemberProfile } from "./PartyMemberProfile";

const Party = ({ tourStart, setTourStart }: TourPageProps) => {
  const location = useLocation() as any;
  const client = new APIClient();
  const [partyId, setPartyId] = useState(localStorage.getItem("partyId") ?? "");
  const [projectMutated, setProjectMutated] = useState("");
  const [addProjectDrawerOpened, setAddProjectDrawerOpened] = useState(false);
  const [editProjectDrawerOpened, setEditProjectDrawerOpened] = useState(false);
  const [editPartyDrawerOpened, setEditPartyDrawerOpened] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const queryClient = useQueryClient();
  const { classes } = projectCardStyles();
  const [, setHeaderText] = useContext(HeaderContext);

  // -- JOYRIDE

  const theme = useMantineTheme();
  const [{ run, steps, stepIndex }, setTour] = useState<JoyrideStateProps>({
    run: JSON.parse(localStorage.getItem("isNewUser") ?? "false"),
    steps: tutorialSteps["party"],
    stepIndex: 0,
  });

  useEffect(() => {
    return () => {
      if (setTourStart) setTourStart(false);
    };
  }, [setTourStart]);

  useEffect(() => {
    setTour((prev) => ({
      ...prev,
      run: tourStart ?? false,
    }));
  }, [tourStart]);

  const helpers = useRef<StoreHelpers>();

  const setHelpers = (storeHelpers: StoreHelpers) => {
    helpers.current = storeHelpers;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const {
      lifecycle,
      action,
      index,
      status,
      type,
      step: { target },
    } = data;

    console.log("[joyride]", data);

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setTour((prev) => ({
        ...prev,
        run: false,
        stepIndex: 0,
      }));
      if (setTourStart) setTourStart(false);
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      // Update state to advance the tour
      setTour((prev) => ({
        ...prev,
        run: true,
        stepIndex: nextStepIndex,
      }));
    }
  };

  // -- JOYRIDE

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

  useEffect(() => {
    cleanNotifications();
  }, []);

  useEffect(() => {
    setHeaderText("Don't let them slack off");
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

  if (!partyId) {
    return <NoParty onJoinParty={setPartyId} />;
  }

  return (
    <>
      <ReactJoyride
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        disableCloseOnEsc
        disableOverlayClose
        hideCloseButton
        stepIndex={stepIndex}
        run={run}
        steps={steps}
        getHelpers={setHelpers}
        styles={joyrideStyles(theme)}
        callback={handleJoyrideCallback}
      />
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
            height: "100%",
          }}
          spacing={20}
        >
          <Stack data-tut="party-members">
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
              <Group noWrap pb={20}>
                {party.members
                  .sort(
                    (u1, u2) =>
                      u2.statistics.party.level - u1.statistics.party.level
                  )
                  .map((member: IUser, idx: number) => (
                    <PartyMemberProfile key={idx} user={member} />
                  ))}
              </Group>
            </ScrollArea>
          </Stack>

          <Group
            align="stretch"
            position="apart"
            noWrap
            style={{ overflow: "hidden", flexGrow: 1 }}
          >
            <Stack data-tut="party-quests">
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
                    sx={() => ({
                      ...sizeOptions["lg"].card,
                    })}
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
            <Stack data-tut="party-chat">
              <Text size="xl" weight="bold">
                Chat
              </Text>
              <Chat users={party.members} />
            </Stack>
          </Group>
        </Stack>
      )}
    </>
  );
};

export default Party;
