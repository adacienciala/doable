import { Button, Group, LoadingOverlay, Modal, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ApiError } from "../../api/errors";
import { APIClient, Method } from "../../api/task";

const Party = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();

  const {
    isLoading,
    isSuccess,
    error,
    data: party,
  } = useQuery(["party", localStorage.getItem("partyId")!], () => {
    const partyId = localStorage.getItem("partyId")!;
    return client.singleParty(Method.GET, partyId);
  });

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
      {isSuccess && (
        <Group
          align={"stretch"}
          style={{
            height: "100%",
            gap: 0,
          }}
          noWrap
        >
          {party.name}
        </Group>
      )}
    </>
  );
};

export default Party;
