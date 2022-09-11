import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { IUser } from "../../models/user";
import { HeaderContext } from "../../utils/context";
import UserAccount from "./UserAccount";
import UserStatistics from "./UserStatistics";

const Settings = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const [, setHeaderText] = useContext(HeaderContext);

  const { isLoading, error, data } = useQuery<IUser>(
    ["user", localStorage.getItem("doableId")!],
    () => {
      const doableId = localStorage.getItem("doableId")!;
      return client.singleUser(Method.GET, doableId);
    }
  );

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
      <Group
        position="apart"
        align="stretch"
        grow
        style={{
          padding: "20px",
          height: "100%",
        }}
      >
        <UserAccount user={data} />
        <UserStatistics user={data} />
      </Group>
    </>
  );
};

export default Settings;
