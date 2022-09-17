import {
  Avatar,
  Button,
  Group,
  Image,
  Indicator,
  LoadingOverlay,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { APIClient, Method } from "../../../api/client";
import { ApiError } from "../../../api/errors";
import { AccessDeniedModal } from "../../../layouts/AccessDeniedModal";
import { IParty } from "../../../models/party";
import Lemonade from "./lemonade-chill.svg";

interface PartyItemProps extends IParty, ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
}

const PartyItem = forwardRef<HTMLDivElement, PartyItemProps>(
  (
    { cover, name, description, members, partyId, ...others }: PartyItemProps,
    ref
  ) => (
    <Group ref={ref} {...others}>
      <Indicator
        inline
        label={members.length}
        size={16}
        offset={7}
        position="bottom-end"
        color="blue.5"
        withBorder
      >
        <Avatar src={cover} />
      </Indicator>
      <div>
        <Text size="sm">{name}</Text>
        <Text size="xs" color="dimmed">
          {description}
        </Text>
      </div>
    </Group>
  )
);

export default function NoParty({ onJoinParty }: { onJoinParty: any }) {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const client = new APIClient();
  const queryClient = useQueryClient();

  const [chosenParty, setChosenParty] = useState<string | null>(null);
  const [data, setData] = useState<PartyItemProps[]>([]);

  const {
    isLoading,
    error,
    data: parties,
  } = useQuery<IParty[]>(
    ["parties"],
    async () => await client.parties(Method.GET)
  );

  const addPartyMutation = useMutation(
    (data: Partial<IParty>) =>
      client.parties(Method.POST, {
        body: data,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["parties"]);
        queryClient.invalidateQueries(["user"]);
        onJoinParty(data.partyId);
      },
    }
  );

  const editPartyMutation = useMutation(
    (data: Partial<IParty>) =>
      client.singleParty(Method.PUT, chosenParty!, {
        body: data,
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["parties"]);
        queryClient.invalidateQueries(["user"]);
        onJoinParty(data.party.partyId);
      },
    }
  );

  useEffect(() => {
    if (!parties || parties.length < 1) return;
    const mappedData = parties.map((party: IParty) => {
      const newParty: PartyItemProps = {
        ...party,
        value: party.partyId,
        label: party.name,
      };
      return newParty;
    });
    setData(mappedData);
  }, [parties]);

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
      <AccessDeniedModal visible={isAccessError()} />
      <Stack
        sx={() => ({
          justifyContent: "center",
          height: "100%",
        })}
        align={"center"}
      >
        <Image
          src={Lemonade}
          alt="A guy with lemonade on a beach"
          style={{
            width: "40%",
          }}
        />
        <Text>You haven't joined any lemonade party yet.</Text>
        <Select
          sx={{ width: "350px" }}
          placeholder="Pick one"
          itemComponent={PartyItem}
          data={data}
          searchable
          value={chosenParty}
          onChange={(value) => {
            setChosenParty(value);
          }}
          maxDropdownHeight={400}
          nothingFound="Nobody here"
          creatable
          clearable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            addPartyMutation.mutate({ name: query });
            return item;
          }}
          filter={(value, item) =>
            item.name.toLowerCase().includes(value.toLowerCase().trim()) ||
            item.description.toLowerCase().includes(value.toLowerCase().trim())
          }
        />
        <Button
          disabled={!chosenParty}
          variant="filled"
          onClick={() =>
            editPartyMutation.mutate({
              members: (
                data.find((party) => party.partyId === chosenParty)?.members ??
                []
              ).concat(localStorage.getItem("doableId")!),
            })
          }
        >
          Join
        </Button>
      </Stack>
    </>
  );
}
