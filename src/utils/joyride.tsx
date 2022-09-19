import { Image, MantineTheme, Text } from "@mantine/core";
import { Dispatch } from "react";
import { Placement, Step, Styles } from "react-joyride";
import { Link } from "react-router-dom";

export interface JoyrideStateProps {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  taskCreated?: boolean;
  taskDeleted?: boolean;
  projectCreated?: boolean;
}

export interface TourPageProps {
  tourStart?: boolean;
  setTourStart?: Dispatch<React.SetStateAction<boolean>>;
}

export interface HadTutorialProps {
  questProfile?: boolean;
  challenges?: boolean;
  dashboard?: boolean;
  projects?: boolean;
  party?: boolean;
}

export const tutorialSteps: { [key: string]: Step[] } = {
  questProfile: [
    {
      title: "Quest profile tour",
      target: "body",
      content: (
        <Text>
          Welcome to your quest profile, it's so nice to meet you! Here you can
          find your public profile and some important information about the
          Life's Quest for Zest story.
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
      title: "Your profile",
      target: '[data-tut="profile"]',
      content: (
        <>
          <Text mb={10}>
            <Text>
              Your <strong>avatar</strong> shows how cool you would look as an
              animal! Don't like it? You can always change it in the
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
            The ring around the picture shows your curent{" "}
            <strong>progress</strong>. Try <u>hovering</u> over your avatar.
            That's how much XP you have.
          </Text>
          <Text>Want to have more? Finish tasks!</Text>
        </>
      ),
      spotlightClicks: true,
      placement: "right" as Placement,
      disableBeacon: false,
    },
    {
      title: "Story",
      target: '[data-tut="ranks-story"]',
      content: (
        <>
          <Text mb={10}>
            Here's a recap on the parts of the story you already unlocked. Every
            user gets their own storyline, tailored especially for them and
            their style of play.
          </Text>
          <Text mb={10}>
            Each story is associated with a <strong>rank</strong>. The more XP
            you gain, the higher rank you get. With a higher rank, you get more
            and more information about <b>The Zest</b>.{" "}
          </Text>
          <Text>
            Curious to knwow more? Gain XP and unravel, how the story ends!
          </Text>
        </>
      ),
      placement: "center" as Placement,
      disableBeacon: false,
    },
    {
      title: "Rewards",
      target: '[data-tut="rewards-list"]',
      content: (
        <>
          <Text>
            Some actions that you take will be noticed and awarded with a
            special achievement. They will show up here, a list of rewards for
            everyone to see.
          </Text>
        </>
      ),
      placement: "auto" as Placement,
      disableBeacon: false,
    },
    {
      title: "Challenges",
      target: '[data-tut="challenges"]',
      content: (
        <>
          <Text mb={10}>
            Do you want to know what challenges await for you? Go ahead and
            click the <b>challenges</b> tab!
          </Text>
        </>
      ),
      placement: "right" as Placement,
      disableBeacon: false,
      spotlightClicks: true,
    },
  ],
  dashboard: [
    {
      title: "Dashboard tour",
      target: "body",
      content: (
        <Text>
          Welcome to your dashboard! Here you can find the most important
          information about you journey with Doable. Let's have a look, shall
          we?
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
      title: "Backlog",
      target: '[data-tut="backlog"]',
      content: (
        <>
          <Text>
            Here you can find the list of the tasks that require your utmost
            attention - the things you <i>forgot</i> to do, the things you have
            to do <i>today</i>, or the things you haven't yet <i>scheduled</i>.
          </Text>
        </>
      ),
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "Add a new task",
      target: '[data-tut="add-task"]',
      content: (
        <>
          <Text>
            Let's create a new task! To do that, just click on the plus button.
            This time, if you don't mind, I'll do the task for you.
          </Text>
        </>
      ),
      placement: "left" as Placement,
      disableBeacon: false,
    },
    {
      title: "Managing your tasks",
      target: '[data-tut="created-task"]',
      content: (
        <>
          <Text mb={10}>
            Here you go, there's our task! As you can see, it has a <b>title</b>
            , <b>scheduled date</b>, and a <b>project</b> it belongs to.
          </Text>
          <Text>
            To edit those, you'd have to click the task but we'll leave it for
            later.
          </Text>
        </>
      ),
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "Finishing tasks",
      target: '[data-tut="finish-task"]',
      content: (
        <>
          <Text mb={10}>
            We mentioned before that to get XP, you have to <b>finish</b> your
            tasks. Depending on their difficulty, you gain less or more points.
            If you finish a task by accident - don't worry, you'll have a moment
            to undo it.
          </Text>
          <Text>Now, please do the honors and click the checkbox!</Text>
        </>
      ),
      spotlightClicks: true,
      styles: {
        buttonNext: { pointerEvents: "none", backgroundColor: "gray" },
      },
      placement: "right" as Placement,
      disableBeacon: false,
    },
    {
      title: "Great job",
      target: '[data-tut="user-scoreboard"]',
      content: (
        <>
          <Text mb={10}>
            That was awesome! And you gained XP for it, already!
          </Text>
          <Text>
            You can see yourself in the scoreboard, right here. Keep up the good
            work and strive for the first place. Achievements like those don't
            go unnoticed...
          </Text>
        </>
      ),
      placement: "left" as Placement,
      disableBeacon: false,
    },
    {
      title: "Projects",
      target: '[data-tut="projects"]',
      content: (
        <>
          <Text>
            Let's group your tasks under <b>projects</b>. Go ahead, click the
            tab!
          </Text>
        </>
      ),
      placement: "right" as Placement,
      disableBeacon: false,
      spotlightClicks: true,
    },
  ],
  projects: [
    {
      title: "Projects tour",
      target: "body",
      content: (
        <Text>
          Welcome to your projects! Every task that you create you can group
          under a specific project. This page shows all the projects that you
          have access to.
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
      title: "Add a new project",
      target: '[data-tut="add-project"]',
      content: (
        <>
          <Text mb={10}>
            Let's <b>create</b> a new project! To do that, you just have to
            click this plus button.
          </Text>
          <Text>
            Go ahead, click next, and give us a second to create a project for
            you real quick...
          </Text>
        </>
      ),
      placement: "right" as Placement,
      disableBeacon: false,
    },
    {
      title: "Managing your projects",
      target: '[data-tut="created-project"]',
      content: (
        <>
          <Text mb={10}>
            Here you go, a perfectly good project especially for you!
          </Text>
          <Text>
            There are several things going on here, so let's have a deeper look.
          </Text>
        </>
      ),
      placement: "left" as Placement,
      disableBeacon: false,
    },
    {
      title: "Managing your projects",
      target: '[data-tut="project-edit"]',
      content: (
        <>
          <Text>
            This menu will let you <b>edit</b> or <b>delete</b> the project.
          </Text>
        </>
      ),
      placement: "left" as Placement,
      disableBeacon: false,
    },
    {
      title: "Tracking the progress",
      target: '[data-tut="project-cover"]',
      content: (
        <>
          <Text mb={10}>
            If you don't set a cover to the project, you will see your progress
            on the project here.
          </Text>
          <Text mb={10}>
            Now it is 0% because we've put tasks in there and you haven't
            finished them yet...
          </Text>
          <Text mb={10}>
            But as you can see below, finishing tasks will <b>raise</b> the
            progres on the project.
          </Text>
          <Image
            radius={66}
            src="/project_progress_trans.gif"
            alt="Project progress gif"
            withPlaceholder
            placeholder={
              <Text align="center">
                This was a cool gif but something went wrong
              </Text>
            }
          />
        </>
      ),
      placement: "auto" as Placement,
      disableBeacon: false,
    },
    {
      title: "Taking care of the project",
      target: '[data-tut="project-cover"]',
      content: (
        <>
          <Text mb={10}>
            The progress can raise but it can also <b>drop</b>! If you add more
            and more tasks, and never finish them, you make the project look a
            bit miserable...
          </Text>
          <Image
            radius={66}
            src="/project_progress_drop_trans.gif"
            alt="Project progress dropping gif"
            withPlaceholder
            placeholder={
              <Text align="center">
                This was a cool gif but something went wrong
              </Text>
            }
          />
          <Text mb={10}>
            Always try to keep the progress in the green area. We know you can
            do it!
          </Text>
          <Text mb={10}>
            And if you manage to get it to 100%? Give yourself a good treat,
            tell your friends, and you can delete the project with a clear
            conscience.
          </Text>
        </>
      ),
      placement: "auto" as Placement,
      disableBeacon: false,
    },
    {
      title: "Project owners",
      target: '[data-tut="project-footer"]',
      content: (
        <>
          <Text mb={10}>
            We know working on stuff by yourself is hard. That's why you can
            share a project with friends!
          </Text>
          <Text>
            Here is the list of people who can manipulate this project and its
            tasks. But how to add others, you ask?
          </Text>
        </>
      ),
      placement: "auto" as Placement,
      disableBeacon: false,
    },
    {
      title: "Party",
      target: '[data-tut="party"]',
      content: (
        <>
          <Text mb={10}>
            That's were <b>parties</b> come in. Click on the tab and join a
            party!
          </Text>
        </>
      ),
      spotlightClicks: true,
      placement: "right" as Placement,
      disableBeacon: false,
    },
  ],
  party: [
    {
      title: "Party tour",
      target: "body",
      content: (
        <>
          <Text mb={10}>
            Welcome to your party! Here is the place where you can talk with
            others, motivate each other, do tasks, and call out for laziness -
            whatever you want, really!
          </Text>
          <Text mb={10}>
            Just remember - you and your party are people who share a common
            goal. If you notice that your objectives don't match up amynore, you
            can always leave the party.
          </Text>
          <Text>
            Having that out of the way... let's have a look around here, shall
            we?
          </Text>
        </>
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
      title: "Members",
      target: '[data-tut="party-members"]',
      content: (
        <>
          <Text>
            Here is the list of people that currently share the journey with
            you. The more people in the party, the more hands on deck to finish
            your quests but also, the more the chaos!
          </Text>
        </>
      ),
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "Quests",
      target: '[data-tut="party-quests"]',
      content: (
        <>
          <Text mb={10}>
            Speaking about quests, your goal as party members is to unite and
            finish tasks that you have under quests.
          </Text>
          <Text mb={10}>
            Quests are essentialy projects but they are a responsibility of all
            of you. While a big quest can seem scary and unachievable to do
            alone, a project that is divided between party members turns into a
            manageable challenge.
          </Text>
          <Text>Break down the work and cooperate so you all win!</Text>
        </>
      ),
      placement: "auto" as Placement,
      disableBeacon: false,
    },
    {
      title: "Chat",
      target: '[data-tut="party-chat"]',
      content: (
        <>
          <Text mb={10}>
            Do you have a big task ahead of you and you're not sure you can do
            it?
          </Text>
          <Text mb={10}>
            Or you see the deadline is coming, the quest has not been finished,
            and your fellow party members are in trouble?
          </Text>
          <Text mb={10}>
            Jump into the chat, motivate each other, and talk trash about how
            life is hard. After that - spring into action, do the tasks, and
            save the party!
          </Text>
        </>
      ),
      placement: "left" as Placement,
      disableBeacon: false,
    },
    {
      title: "Party profile",
      target: '[data-tut="party-profile"]',
      content: (
        <>
          <Text mb={10}>
            Each member of your party can see your XP and rank. Next you have
            the indicator of your party level - it rises whenever you do tasks
            under party's quests.
          </Text>
          <Text mb={10}>
            If you see that someone from your party is not rising their party
            level, that means they're slacking off for some reason. Reach out to
            them, maybe they need your help!
          </Text>
          <Text mb={10}>
            Here you can also see the <b>quest profile</b> of each party member.
            After clicking on it, you might see some more information about
            their journey.
          </Text>
          <Text>Curious what yours looks like? Go ahead!</Text>
        </>
      ),
      placement: "bottom" as Placement,
      disableBeacon: false,
      spotlightClicks: true,
    },
  ],
};

const fontStyles = (theme: MantineTheme) => ({
  color: theme.colors.gray[9],
  fontFamily: theme.fontFamily,
  fontSize: theme.fontSizes.sm,
});

export const joyrideStyles = (theme: MantineTheme): Styles => ({
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
  tooltipContent: {
    textAlign: "left",
  },
});

export const mockProjectTasks = [
  {
    title: "Breath in",
    description: "After that, finish this task",
    date: new Date(),
  },
  {
    title: "Breath out",
    description: "The finish this task",
    date: new Date(),
  },
  {
    title: "Smile",
    description: "You're doing great, finish this task",
    date: new Date(),
  },
];
