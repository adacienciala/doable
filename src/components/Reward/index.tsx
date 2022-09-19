import { Group, MantineTheme, Progress, Stack, Text } from "@mantine/core";
import {
  RiCompassFill,
  RiFundsFill,
  RiMedalFill,
  RiShieldStarFill,
  RiTeamFill,
  RiTodoFill,
} from "react-icons/ri";
import { IReward } from "../../models/rewards";

export const Reward = ({
  reward,
  isTutorialReward,
}: {
  reward: IReward;
  isTutorialReward?: boolean;
}) => {
  const getDifficultyColor = (theme: MantineTheme) => {
    switch (reward.difficulty) {
      case "gold":
        return theme.colors.yellow[6];
      case "silver":
        return theme.colors.blue[2];
      case "bronze":
        return theme.colors.orange[6];
      default:
        return theme.colors.gray[6];
    }
  };

  const getProgressColor = (theme: MantineTheme) =>
    reward.progress >= 100 ? theme.colors.gray[9] : theme.colors.gray[8];

  const getRewardIcon = (reward: IReward) => {
    switch (reward.type.toLowerCase()) {
      case "tasks":
        return RiTodoFill;
      case "party":
        if (reward.value === 0) {
          return RiCompassFill;
        }
        return RiMedalFill;
      default:
        return RiFundsFill;
    }
  };

  return (
    <Stack
      align="stretch"
      key={reward.rewardId}
      sx={(theme) => ({
        marginRight: "50px",
        height: "300px",
        width: "300px",
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box",
        borderRadius: "8px",
        boxShadow:
          "0 1px 3px rgb(0 0 0 / 5%), rgb(0 0 0 / 5%) 0px 10px 15px -5px, rgb(0 0 0 / 4%) 0px 7px 7px -5px",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: getProgressColor(theme),
        backgroundColor: getProgressColor(theme),
        justifyContent: "space-between",
        ":hover": {
          scale: "1.05",
        },
        color:
          reward.progress >= 100
            ? getDifficultyColor(theme)
            : theme.colors.gray[6],
      })}
    >
      <Progress
        radius="xl"
        size="xl"
        value={reward.progress}
        label={reward.progress + "%"}
        styles={(theme) => ({
          root: {
            backgroundColor: theme.colors.gray[6],
          },
          label: {
            color: theme.colors.gray[9],
          },
        })}
        {...(isTutorialReward ? { "data-tut": "reward-progress" } : {})}
      />
      {getRewardIcon(reward)({
        size: 120,
        style: { alignSelf: "center" },
      })}
      <Text weight={500}>{reward.title}</Text>
      <Text size="xs" weight={300}>
        {reward.description}
      </Text>
      <Group
        noWrap
        sx={(theme) => ({
          color: getDifficultyColor(theme),
          justifyContent: "space-between",
        })}
      >
        <RiShieldStarFill
          size={20}
          {...(isTutorialReward ? { "data-tut": "reward-difficulty" } : {})}
        />
        <Group
          {...(isTutorialReward ? { "data-tut": "reward-popularity" } : {})}
        >
          <RiTeamFill size={20} />
          <Text>{reward.popularity}</Text>
        </Group>
      </Group>
    </Stack>
  );
};
