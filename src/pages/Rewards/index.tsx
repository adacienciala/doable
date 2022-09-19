import { Group, LoadingOverlay, ScrollArea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Reward } from "../../components/Reward";
import { AccessDeniedModal } from "../../layouts/AccessDeniedModal";
import { IReward } from "../../models/rewards";
import { HeaderContext } from "../../utils/headerContext";

const Rewards = () => {
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
          {rewards && rewards.map((reward) => <Reward reward={reward} />)}
        </Group>
      </ScrollArea>
    </>
  );
};

export default Rewards;
