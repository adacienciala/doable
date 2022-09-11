import {
  Button,
  Center,
  Drawer,
  Modal,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { APIClient, Method, PartyExtended } from "../../api/client";
import { IParty } from "../../models/party";

interface PartyEditDrawerProps {
  party?: PartyExtended;
  opened: boolean;
  onClose: () => void;
  onLeave: () => void;
  onDelete: () => void;
}

export const PartyEditDrawer = ({
  party,
  opened,
  onClose,
  onLeave,
  onDelete,
}: PartyEditDrawerProps) => {
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openLeaveModal, setOpenLeaveModal] = useState(false);

  const editPartyMutation = useMutation(
    (data: Partial<IParty>) =>
      client.singleParty(Method.PUT, party!.partyId, {
        body: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["party"]);
        queryClient.invalidateQueries(["parties"]);
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const deletePartyMutation = useMutation(
    () => client.singleParty(Method.DELETE, party!.partyId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["party"]);
        queryClient.invalidateQueries(["parties"]);
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const form = useForm<Partial<IParty> & Pick<IParty, "name">>({
    initialValues: {
      name: party?.name ?? "",
      description: party?.description ?? "",
      cover: party?.cover ?? "",
    },
    validate: {
      name: (value: string) => (value.length > 0 ? null : "Enter a name"),
    },
  });

  useEffect(() => {
    if (party) {
      form.setValues({
        name: party.name,
        description: party.description || "",
        cover: party.cover || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [party]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }
    editPartyMutation.mutate(form.values);
    form.reset();
    onClose();
  }

  function handleDelete(event: MouseEvent<HTMLElement>) {
    deletePartyMutation.mutate();
    setOpenDeleteModal(false);
    form.reset();
    onDelete();
  }

  function handleLeave(event: MouseEvent<HTMLElement>) {
    const doableId = localStorage.getItem("doableId")!;
    const membersWithoutUser = party?.members
      .map((m) => m.doableId)
      .filter((id) => id !== doableId);
    editPartyMutation.mutate({ members: membersWithoutUser });
    setOpenLeaveModal(false);
    form.reset();
    onLeave();
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Edit Party"
        padding="xl"
        size="50%"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            data-autofocus
            mt="md"
            required
            label="Title"
            placeholder="Title"
            value={form.values.name}
            onBlur={() => form.values.name !== "" && form.validateField("name")}
            {...form.getInputProps("name")}
          />
          <TextInput
            mt="md"
            label="Description"
            placeholder="Description"
            value={form.values.description}
            {...form.getInputProps("description")}
          />
          <TextInput
            mt="md"
            label="Cover (link)"
            placeholder="Cover (link)"
            value={form.values.cover}
            {...form.getInputProps("cover")}
          />
          <Center style={{ height: "100px" }}>
            <Button
              variant="outline"
              color={"red"}
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete
            </Button>
            <Space w="md" />
            <Button
              variant="outline"
              color={"red"}
              onClick={() => setOpenLeaveModal(true)}
            >
              Leave
            </Button>
            <Space w="md" />
            <Button
              type="submit"
              styles={(theme) => ({
                root: { color: theme.colors.gray[9] },
              })}
            >
              Save
            </Button>
          </Center>
        </form>
      </Drawer>
      <Modal
        centered
        opened={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete party"
      >
        <Text size="sm">
          Are you sure you want to delete this party? All members will lost
          their party. This action is irreversible.
        </Text>
        <Center style={{ height: "70px" }}>
          <Button
            variant="light"
            color={"gray"}
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancel
          </Button>
          <Space w="md" />
          <Button variant="outline" color={"red"} onClick={handleDelete}>
            Delete party
          </Button>
        </Center>
      </Modal>
      <Modal
        centered
        opened={openLeaveModal}
        onClose={() => setOpenLeaveModal(false)}
        title="Leave party"
      >
        <Text size="sm">
          Are you sure you want to leave this party? You will lose your party
          level and access to quests.
        </Text>
        <Center style={{ height: "70px" }}>
          <Button
            variant="light"
            color={"gray"}
            onClick={() => setOpenLeaveModal(false)}
          >
            Cancel
          </Button>
          <Space w="md" />
          <Button variant="outline" color={"red"} onClick={handleLeave}>
            Leave party
          </Button>
        </Center>
      </Modal>
    </>
  );
};
