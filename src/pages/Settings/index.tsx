import { Avatar, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import avatar from "animal-avatar-generator";
import { useCallback, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { IReward } from "../../models/rewards";
import { IUser } from "../../models/user";
import { HeaderContext } from "../../utils/headerContext";
import { getUserAvatarSeed } from "../../utils/utils";
import UserAccountForm from "./UserAccountForm";
import UserStatistics from "./UserStatistics";

const Settings = () => {
  const location = useLocation() as any;
  const client = new APIClient();
  const [, setHeaderText] = useContext(HeaderContext);

  const {
    isLoading,
    error,
    data: resData,
  } = useQuery<{
    user: IUser;
    rewards: IReward[];
  }>(["user", localStorage.getItem("doableId")!], () => {
    const doableId = localStorage.getItem("doableId")!;
    return client.singleUser(Method.GET, doableId);
  });
  const data = resData?.user;

  const isAccessError = useCallback(
    () => (error ? new ApiError(error).code === 403 : false),
    [error]
  );

  useEffect(() => {
    setHeaderText("Customize whatever you need");
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
      <AccessDeniedModal visible={isAccessError()} />
      <Group
        position="apart"
        align="stretch"
        grow
        style={{
          padding: "20px",
          height: "100%",
        }}
      >
        <Stack align={"stretch"}>
          <Text size="xl" weight="bold">
            Edit profile
          </Text>
          <Avatar
            style={{ alignSelf: "center" }}
            size={120}
            src={`data:image/svg+xml;UTF-8,${encodeURIComponent(
              avatar(getUserAvatarSeed(data))
            )}`}
          />
          <UserAccountForm user={data} />
        </Stack>
        <Stack>
          <Text size="xl" weight="bold">
            Statistics
          </Text>
          <UserStatistics user={data} />
        </Stack>
      </Group>
    </>
  );
};

export default Settings;
