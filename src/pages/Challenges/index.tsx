import {
  Group,
  LoadingOverlay,
  ScrollArea,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactJoyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  Placement,
  STATUS,
  StoreHelpers,
} from "react-joyride";
import { Link, Navigate, useLocation } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Reward } from "../../components/Reward";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { IReward } from "../../models/rewards";
import { HeaderContext } from "../../utils/headerContext";
import {
  HadTutorialProps,
  JoyrideStateProps,
  joyrideStyles,
  TourPageProps,
} from "../../utils/joyride";

const Challenges = ({ tourStart, setTourStart }: TourPageProps) => {
  const location = useLocation() as any;
  const client = new APIClient();
  const [, setHeaderText] = useContext(HeaderContext);

  const {
    isLoading,
    error,
    data: rewards,
  } = useQuery<IReward[]>(
    ["rewards", localStorage.getItem("doableId")!],
    () => {
      const doableId = localStorage.getItem("doableId")!;
      return client.rewards(Method.GET, doableId);
    }
  );

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

  useEffect(() => {
    setHeaderText("Well well, aren't they beautiful");
  }, [setHeaderText]);

  // -- JOYRIDE

  const hadTutorial = JSON.parse(
    localStorage.getItem("hadTutorial") ?? "{}"
  ) as HadTutorialProps;

  const theme = useMantineTheme();
  const [{ run, steps, stepIndex }, setTour] = useState<JoyrideStateProps>({
    run: hadTutorial.challenges === false,
    steps: [
      {
        title: "Challenges tour",
        target: "body",
        content: (
          <Text>
            Welcome to your challenges! Beforhand lie all actions that you can
            take that are tracked and properly noticed. If you want to earn a
            reward, you can find all the needed information here.
          </Text>
        ),
        styles: {
          tooltipContent: {
            textAlign: "center",
          },
        },
        placement: "center" as Placement,
        disableBeacon: true,
      },
      {
        title: "Reward progress",
        target: '[data-tut="reward-progress"]',
        content: (
          <>
            <Text mb={10}>
              This is the progress bar. The closer you are to finishing the
              challenge, the fuller the bar gets.
            </Text>
            <Text>
              Once the progress reaches 100%, you get the reward for yourself!
            </Text>
          </>
        ),
        placement: "bottom" as Placement,
        disableBeacon: false,
      },
      {
        title: "Reward difficulty",
        target: '[data-tut="reward-difficulty"]',
        content: (
          <>
            <Text mb={10}>
              Not all challenges are equally easy to get. Some are harder, and
              some are even more hard.
            </Text>
            <Text>
              This icon shows the <b>difficulty</b> of this challenge. It has
              three different levels:
            </Text>
            <ul>
              <li>bronze</li>
              <li>silver</li>
              <li>gold</li>
            </ul>
          </>
        ),
        placement: "right" as Placement,
        disableBeacon: false,
      },
      {
        title: "Reward popularity",
        target: '[data-tut="reward-popularity"]',
        content: (
          <>
            <Text mb={10}>
              This icon shows how many people have already managed to finish the
              challenge and got the reward for themselves.
            </Text>
            <Text>
              Once the reward is achieved, it can be seen on your public{" "}
              <Text
                underline
                span
                component={Link}
                to={`/profile/${localStorage.getItem("doableId")!}`}
                target="_blank"
              >
                quest profile page.
              </Text>
            </Text>
          </>
        ),
        placement: "right" as Placement,
        disableBeacon: false,
      },
      {
        title: "Dashboard",
        target: '[data-tut="dashboard"]',
        content: (
          <>
            <Text>
              Would you like to finish some tasks to get the rewards? Click on
              the <b>dashboard</b> tab and see what's ahead of you.
            </Text>
          </>
        ),
        placement: "right" as Placement,
        disableBeacon: false,
        spotlightClicks: true,
      },
    ],
    stepIndex: 0,
  });

  useEffect(() => {
    setTour((prev) => ({
      ...prev,
      run: tourStart || hadTutorial.challenges === false,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStart]);

  useEffect(() => {
    return () => {
      if (setTourStart) setTourStart(false);
      localStorage.setItem(
        "hadTutorial",
        JSON.stringify({
          ...hadTutorial,
          challenges: true,
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTourStart]);

  const helpers = useRef<StoreHelpers>();

  const setHelpers = (storeHelpers: StoreHelpers) => {
    helpers.current = storeHelpers;
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { action, index, status, type } = data;

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
          challenges: true,
        })
      );
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
      <ScrollArea
        style={{
          height: "100%",
        }}
        type="hover"
      >
        <Group
          align="flex-start"
          style={{
            padding: "20px",
          }}
        >
          {rewards &&
            rewards.map((reward, idx) => (
              <Reward
                key={reward.rewardId}
                isTutorialReward={run && idx === 0}
                reward={reward}
              />
            ))}
        </Group>
      </ScrollArea>
    </>
  );
};

export default Challenges;
