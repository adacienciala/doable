import {
  Button,
  Group,
  LoadingOverlay,
  MantineTheme,
  Modal,
  Progress,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect } from "react";
import {
  RiCompassFill,
  RiFundsFill,
  RiMedalFill,
  RiShieldStarFill,
  RiTodoFill,
} from "react-icons/ri";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { IReward } from "../../models/rewards";
import { HeaderContext } from "../../utils/context";

const Rewards = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
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

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

  useEffect(() => {
    setHeaderText("Well well, aren't they beautiful");
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
            rewards.map((reward) => {
              const getRarityColor = (theme: MantineTheme) => {
                switch (reward.rarity) {
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
                reward.progress === 100
                  ? theme.colors.gray[9]
                  : theme.colors.gray[8];
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
                      reward.progress === 100
                        ? getRarityColor(theme)
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
                      color: getRarityColor(theme),
                      justifyContent: "space-between",
                    })}
                  >
                    <RiShieldStarFill size={20} />
                    <Text>{reward.popularity}</Text>
                  </Group>
                </Stack>
              );
            })}
        </Group>
      </ScrollArea>
    </>
  );
};

export default Rewards;
