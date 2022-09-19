import {
  Button,
  Card,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Space,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MouseEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RiAddFill } from "react-icons/ri";
import ReactJoyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  LIFECYCLE,
  STATUS,
  StoreHelpers,
} from "react-joyride";
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
import { IProject } from "../../models/project";
import { ITask } from "../../models/task";
import { HeaderContext } from "../../utils/headerContext";
import {
  HadTutorialProps,
  JoyrideStateProps,
  joyrideStyles,
  mockProjectTasks,
  TourPageProps,
  tutorialSteps,
} from "../../utils/joyride";

const Projects = ({ tourStart, setTourStart }: TourPageProps) => {
  const location = useLocation() as any;
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [projectMutated, setProjectMutated] = useState("");
  const [addProjectDrawerOpened, setAddProjectDrawerOpened] = useState(false);
  const [editProjectDrawerOpened, setEditProjectDrawerOpened] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { classes } = projectCardStyles();
  const [, setHeaderText] = useContext(HeaderContext);

  // -- JOYRIDE

  const hadTutorial = JSON.parse(
    localStorage.getItem("hadTutorial") ?? "{}"
  ) as HadTutorialProps;

  const theme = useMantineTheme();
  const [{ run, steps, stepIndex, projectCreated }, setTour] =
    useState<JoyrideStateProps>({
      run: hadTutorial.projects === false,
      steps: tutorialSteps["projects"],
      stepIndex: 0,
    });

  useEffect(() => {
    return () => {
      if (setTourStart) setTourStart(false);
      localStorage.setItem(
        "hadTutorial",
        JSON.stringify({
          ...hadTutorial,
          projects: true,
        })
      );
    };
  }, [setTourStart]);

  useEffect(() => {
    setTour((prev) => ({
      ...prev,
      run: tourStart || hadTutorial.projects === false,
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
        projectCreated: false,
      }));
      if (setTourStart) setTourStart(false);
      localStorage.setItem(
        "hadTutorial",
        JSON.stringify({
          ...hadTutorial,
          projects: true,
        })
      );
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      // Create an example project and tasks
      if (
        lifecycle === LIFECYCLE.COMPLETE &&
        target === '[data-tut="add-project"]' &&
        action === ACTIONS.NEXT &&
        !projectCreated
      ) {
        addProjectMutation.mutate({
          name: "Create a project",
        });
        setTour((prev) => ({
          ...prev,
          run: false,
          projectTasksCount: 0,
        }));
      } else {
        // Update state to advance the tour
        setTour((prev) => ({
          ...prev,
          run: true,
          stepIndex: nextStepIndex,
        }));
      }
    }
  };

  // -- JOYRIDE

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

  const addProjectMutation = useMutation(
    (data: Partial<IProject>) =>
      client.projects(Method.POST, {
        body: data,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["projects"]);
        queryClient.invalidateQueries(["party"]);
        localStorage.setItem("tutorialProjectId", data.projectId);
        addTaskMutation.mutate({
          ...mockProjectTasks[0],
          projectId: data.projectId,
        });
        addTaskMutation.mutate({
          ...mockProjectTasks[1],
          projectId: data.projectId,
        });
        addTaskMutation.mutate({
          ...mockProjectTasks[2],
          projectId: data.projectId,
        });
        setTimeout(
          () =>
            setTour((prev) => ({
              ...prev,
              run: true,
              stepIndex: prev.stepIndex + 1,
              projectCreated: true,
            })),
          300
        );
      },
    }
  );

  const addTaskMutation = useMutation(
    (data: Partial<ITask>) =>
      client.tasks(Method.POST, {
        body: data,
      }),
    {
      onSuccess: (data) => {
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
        <ScrollArea
          style={{
            height: "100%",
          }}
        >
          <Group
            align="stretch"
            style={{
              padding: "20px",
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
              data-tut="add-project"
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
        </ScrollArea>
      )}
    </>
  );
};

export default Projects;
