import { Group, LoadingOverlay, useMantineTheme } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactJoyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  LIFECYCLE,
  STATUS,
  StoreHelpers,
} from "react-joyride";
import { Navigate, useLocation } from "react-router-dom";
import { APIClient, Method, TaskExtended } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Scoreboard } from "../../components/Scoreboard";
import { TaskData } from "../../components/TaskPill";
import { TaskAddDrawer } from "../../containers/TaskAddDrawer";
import { TaskEditDrawer } from "../../containers/TaskEditDrawer";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { ITask } from "../../models/task";
import { IUser } from "../../models/user";
import { HeaderContext } from "../../utils/headerContext";
import {
  HadTutorialProps,
  JoyrideStateProps,
  joyrideStyles,
  TourPageProps,
  tutorialSteps,
} from "../../utils/joyride";
import { CalendarBacklog } from "./CalendarBacklog";

const Dashboard = ({ tourStart, setTourStart }: TourPageProps) => {
  const [, setHeaderText] = useContext(HeaderContext);
  const location = useLocation() as any;
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [editTaskDrawerOpened, setEditTaskDrawerOpened] = useState(false);
  const [taskEdited, setTaskEdited] = useState("");
  const [addTaskDrawerOpened, setAddTaskDrawerOpened] = useState(false);
  const [addTaskData, setAddTaskData] = useState<Partial<TaskData>>({});

  // -- JOYRIDE

  const hadTutorial = JSON.parse(
    localStorage.getItem("hadTutorial") ?? "{}"
  ) as HadTutorialProps;

  const theme = useMantineTheme();
  const [{ run, steps, stepIndex, taskCreated }, setTour] =
    useState<JoyrideStateProps>({
      run: !hadTutorial.dashboard,
      steps: tutorialSteps["dashboard"],
      stepIndex: 0,
    });

  useEffect(() => {
    setTour((prev) => ({
      ...prev,
      run: tourStart || !hadTutorial.dashboard ? true : false,
    }));
  }, [tourStart]);

  useEffect(() => {
    return () => {
      if (setTourStart) setTourStart(false);
      localStorage.setItem(
        "hadTutorial",
        JSON.stringify({
          ...hadTutorial,
          dashboard: true,
        })
      );
    };
  }, [setTourStart]);

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
        taskCreated: false,
      }));
      if (setTourStart) setTourStart(false);
      localStorage.setItem(
        "hadTutorial",
        JSON.stringify({
          ...hadTutorial,
          dashboard: true,
        })
      );
    } else if (
      ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as string[]).includes(type)
    ) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      // Create an example task
      if (
        lifecycle === LIFECYCLE.COMPLETE &&
        target === '[data-tut="add-task"]' &&
        action === ACTIONS.NEXT &&
        !taskCreated
      ) {
        addTaskMutation.mutate({
          title: "Create a task",
          date: new Date(),
        });
        setTour((prev) => ({
          ...prev,
          run: false,
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

  const addTaskMutation = useMutation(
    (data: Partial<ITask>) =>
      client.tasks(Method.POST, {
        body: data,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["tasks"]);
        localStorage.setItem("tutorialTaskId", data.taskId);
        setTimeout(() => {
          setTour((prev) => ({
            steps: prev.steps,
            run: true,
            stepIndex: prev.stepIndex + 1,
            taskCreated: true,
          }));
        }, 400);
      },
    }
  );

  const finishTaskMutation = useMutation(
    (taskId: string) =>
      client.singleTask(Method.PUT, taskId, {
        body: { isDone: true },
      }),
    {
      onSettled: ({ task, userUpdated }) => {
        queryClient.invalidateQueries(["tasks"]);
        if (userUpdated) {
          queryClient.invalidateQueries(["user"]);
          queryClient.invalidateQueries(["users"]);
        }
        if (task.taskId === localStorage.getItem("tutorialTaskId")) {
          setTour((prev) => ({
            ...prev,
            stepIndex: prev.stepIndex + 1,
            run: true,
            taskDeleted: true,
            taskCreated: false,
          }));
        }
      },
    }
  );

  const handleTaskDone = (taskId: string) => {
    finishTaskMutation.mutate(taskId);
    setHeaderText("Great job");
  };

  const handleTaskOnFinish = () => {
    setTour((prev) => ({
      ...prev,
      run: false,
    }));
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
        visible={isLoading || isLoadingTasks}
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
      <Group
        position="apart"
        align="stretch"
        style={{
          gap: "40px",
          padding: "20px",
          height: "100%",
        }}
      >
        {tasks && (
          <CalendarBacklog
            tasks={tasks}
            handleTaskDone={handleTaskDone}
            handleTaskOnFinish={handleTaskOnFinish}
            onTaskClick={handleEditTaskDrawerOpen}
            onAddTask={handleAddTaskDrawerOpen}
          />
        )}
        <Scoreboard users={users ?? []} />
      </Group>
    </>
  );
};

export default Dashboard;
