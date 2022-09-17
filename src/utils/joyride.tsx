import { Box, MantineTheme, Text } from "@mantine/core";
import { Dispatch } from "react";
import { Placement, Step } from "react-joyride";
import { Link } from "react-router-dom";

export interface JoyrideStateProps {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  taskCreated?: boolean;
  taskDeleted?: boolean;
}

export interface TourPageProps {
  tourStart?: boolean;
  setTourStart?: Dispatch<React.SetStateAction<boolean>>;
}

export const tutorialSteps: { [key: string]: Step[] } = {
  dashboard: [
    {
      title: "Dashboard tour",
      target: "body",
      content: (
        <div>
          Welcome to your dashboard! Here you can find the most important
          information about you journey with Doable. Let's have a look, shall
          we?
        </div>
      ),
      placement: "center" as Placement,
      disableBeacon: true,
    },
    {
      title: "Your profile",
      target: '[data-tut="profile"]',
      content: (
        <Box style={{ textAlign: "left" }}>
          <Text mb={10}>
            <Text>
              Your <strong>avatar</strong> shows how cool you would look as an
              animal! Don't like it? Change it in the
            </Text>
            <Text
              underline
              span
              component={Link}
              to="/settings"
              target="_blank"
            >
              settings
            </Text>
            .
          </Text>
          <Text mb={10}>
            <Text>
              The ring around the picture shows your <strong>progress</strong>.
              Try <u>hovering</u> over your avatar. That's how much XP you have.
              Want to have more? Finish tasks!
            </Text>
          </Text>
          <Text>
            <Text>
              With more XP, you get a higher <strong>rank</strong>. For the
              detailed description of those, go to{" "}
              <Text
                underline
                span
                component={Link}
                to="/settings"
                target="_blank"
              >
                settings
              </Text>
              .
            </Text>
          </Text>
        </Box>
      ),
      spotlightClicks: true,
      placement: "right" as Placement,
      disableBeacon: false,
    },
    {
      title: "Backlog",
      target: '[data-tut="backlog"]',
      content: (
        <Box style={{ textAlign: "left" }}>
          <Text>
            Here you can find the list of the tasks that require your utmost
            attention - the things you <i>forgot</i> to do, the things you have
            to do
            <i>today</i>, or the things you haven't yet <i>scheduled</i>.
          </Text>
        </Box>
      ),
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "Add a new task",
      target: '[data-tut="add-task"]',
      content: (
        <Box style={{ textAlign: "left" }}>
          <Text>
            Let's create a new task! To do that, just click on the plus button.
            This time, if you don't mind, I'll do the task for you.
          </Text>
        </Box>
      ),
      placement: "left" as Placement,
      disableBeacon: false,
    },
    {
      title: "Managing your tasks",
      target: '[data-tut="created-task"]',
      content: (
        <Box style={{ textAlign: "left" }}>
          <Text mb={10}>
            Here you go, there's our task! As you can see, it has a <b>title</b>
            , <b>scheduled date</b>, and a <b>project</b> it belongs to.
          </Text>
          <Text>
            To edit those, you'd have to click the task but we'll leave it for
            later.
          </Text>
        </Box>
      ),
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "Finishing tasks",
      target: '[data-tut="finish-task"]',
      content: (
        <Box style={{ textAlign: "left" }}>
          <Text mb={10}>
            We mentioned before that to get XP, you have to <b>finish</b> your
            tasks. Depending on their difficulty, you gain less or more points.
            If you finish a task by accident - don't worry, you'll have a moment
            to undo it.
          </Text>
          <Text>Now, please do the honors and click the checkbox!</Text>
        </Box>
      ),
      spotlightClicks: true,
      styles: {
        buttonNext: { pointerEvents: "none", backgroundColor: "gray" },
      },
      // hideFooter: true,
      placement: "right" as Placement,
      disableBeacon: false,
    },
    {
      title: "Great job",
      target: '[data-tut="user-scoreboard"]',
      content: (
        <Box style={{ textAlign: "left" }}>
          <Text mb={10}>
            That was awesome! And you gained XP for it, already!
          </Text>
          <Text>
            You can see yourself in the scoreboard, right here. Keep up the good
            work and strive for the first place. Achievements like those don't
            go unnoticed...
          </Text>
        </Box>
      ),
      placement: "left" as Placement,
      disableBeacon: false,
    },
    {
      title: "Projects",
      target: '[data-tut="projects"]',
      content: (
        <Box style={{ textAlign: "left" }}>
          <Text>
            Let's group your tasks under <b>projects</b>. Go ahead, click the
            tab!
          </Text>
        </Box>
      ),
      placement: "right" as Placement,
      disableBeacon: false,
      spotlightClicks: true,
    },
  ],
  calendar: [
    {
      title: "calendar tour",
      target: "body",
      content: <div>That's a calendar bruh</div>,
      placement: "center" as Placement,
      disableBeacon: true,
    },
    {
      title: "!",
      target: '[data-tut="profile"]',
      content: "This is my awesome feature!",
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "!",
      target: '[data-tut="nav-links"]',
      content: "This another awesome  secondfeature!",
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
  ],
};

const fontStyles = (theme: MantineTheme) => ({
  color: theme.colors.gray[9],
  fontFamily: theme.fontFamily,
  fontSize: theme.fontSizes.sm,
});

export const joyrideStyles = (theme: MantineTheme) => ({
  options: {
    zIndex: 10000,
    primaryColor: theme.colors.yellow[6],
    textColor: theme.colors.gray[9],
  },
  buttonNext: {
    borderRadius: theme.radius.sm,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    ...fontStyles(theme),
  },
  buttonBack: {
    ...fontStyles(theme),
  },
  buttonSkip: {
    ...fontStyles(theme),
  },
  tooltipContainer: {
    ...fontStyles(theme),
  },
});
