import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../api/client";
import { ApiError } from "../../api/errors";
import { Chat } from "../../containers/Chat";
import { IUser } from "../../models/user";
import NoParty from "./NoParty";
import { PartyMemberProfile } from "./PartyMemberProfile";

const Party = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const [partyId, setPartyId] = useState(localStorage.getItem("partyId") ?? "");

  const {
    isLoading,
    isSuccess,
    error,
    data: party,
  } = useQuery(
    ["party", partyId],
    () => {
      return client.singleParty(Method.GET, partyId);
    },
    {
      enabled: partyId !== "",
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

  if (!partyId) {
    return <NoParty onJoinParty={setPartyId} />;
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
        <Stack
          style={{
            margin: "20px",
          }}
        >
          <Text size="xl" weight="bold">
            Members
          </Text>
          <ScrollArea>
            <Group noWrap style={{ marginBottom: "20px" }}>
              {party.members.map((member: IUser, idx: number) => (
                <PartyMemberProfile key={idx} user={member} />
              ))}
            </Group>
          </ScrollArea>

          <Group>
            <Stack>
              <Text size="xl" weight="bold">
                Quests
              </Text>
              {party.quests &&
                party.quests.map((q: string, idx: number) => (
                  <Text key={idx}>{q}</Text>
                ))}
            </Stack>
            <Chat users={party.members} />
          </Group>
        </Stack>
      )}
    </>
  );
};

export default Party;
