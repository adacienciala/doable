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
import { useCallback } from "react";
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

const rewardIcons = {
  randomA: RiTodoFill,
  randomB: RiCompassFill,
  randomC: RiFundsFill,
  randomD: RiMedalFill,
};

const Rewards = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();

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
          height: "calc(100% - 40px)",
          padding: "20px",
        }}
        type="hover"
      >
        <Group align="flex-start">
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
                  {rewardIcons[reward.cover]({
                    size: 120,
                    style: { alignSelf: "center" },
                  })}
                  <Text weight={500}>{reward.title}</Text>
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