import {
  Box,
  Center,
  Group,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { AvatarProgress } from "../../components/Profile/AvatarProgress";
import { RanksTabs } from "../../components/RanksTabs";
import { Reward } from "../../components/Reward";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { IReward } from "../../models/rewards";
import { IUser } from "../../models/user";
import { HeaderContext } from "../../utils/headerContext";

const QuestProfile = () => {
  const location = useLocation() as any;
  const client = new APIClient();
  const [, setHeaderText] = useContext(HeaderContext);
  const { userId } = useParams();

  const { isLoading, error, data } = useQuery<{
    user: IUser;
    rewards: IReward[];
  }>(["users", userId], () => client.singleUser(Method.GET, userId!));

  const user = data?.user;
  const rewards = data?.rewards;

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

  useEffect(() => {
    setHeaderText("Will you be the one to find the Zest");
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

  if (!user || isLoading) {
    return (
      <LoadingOverlay
        visible={true}
        overlayOpacity={0.8}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />
    );
  }

  return (
    <>
      <AccessDeniedModal visible={isAccessError()} />
      <Stack
        justify="space-between"
        style={{
          height: "100%",
          padding: "20px",
        }}
      >
        <Text style={{ alignSelf: "center" }} size={50} weight="bold">
          The Quest for Zest
        </Text>
        <Text mt={-20} style={{ alignSelf: "center" }} size="xs">
          written for {user?.name} {user?.surname}
        </Text>
        <Group align="stretch" noWrap style={{ flexGrow: 1 }}>
          <Box style={{ flexGrow: 1 }}>
            <RanksTabs user={user!} />
          </Box>
          <Center style={{ width: "30%", minWidth: "30%" }}>
            <AvatarProgress
              sx={(theme) => ({
                "circle:first-of-type": {
                  stroke: theme.colors.gray[6],
                  strokeOpacity: 0.7,
                },
              })}
              user={user}
            />
          </Center>
        </Group>

        <ScrollArea>
          <Group noWrap align="flex-start" style={{ padding: "20px" }}>
            {rewards &&
              rewards
                .filter((r) => r.progress >= 100)
                .map((r) => <Reward key={r.rewardId} reward={r} />)}
          </Group>
        </ScrollArea>
      </Stack>
    </>
  );
};

export default QuestProfile;
