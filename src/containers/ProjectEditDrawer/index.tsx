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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import { APIClient, Method } from "../../api/client";
import { IProject } from "../../models/project";

interface ProjectEditDrawerProps {
  projectId: string;
  opened: boolean;
  onClose: () => void;
}

export const ProjectEditDrawer = ({
  projectId,
  opened,
  onClose,
}: ProjectEditDrawerProps) => {
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    isSuccess,
    error,
    data: project,
  } = useQuery<IProject>(
    ["project", projectId],
    () => client.singleProject(Method.GET, projectId),
    {
      enabled: projectId !== "",
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const editProjectMutation = useMutation(
    (data: Partial<IProject>) =>
      client.singleProject(Method.PUT, projectId, {
        body: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
        queryClient.invalidateQueries(["party"]);
      },
    }
  );

  const deleteProjectMutation = useMutation(
    () => client.singleProject(Method.DELETE, projectId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["projects"]);
      },
    }
  );

  const form = useForm<Partial<IProject> & Pick<IProject, "name">>({
    initialValues: {
      name: "",
      cover: "",
    },
    validate: {
      name: (value: string) => (value.length > 0 ? null : "Enter a name"),
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.setValues({
        name: project.name,
        cover: project.cover,
        owner: project.owner,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, project]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }
    editProjectMutation.mutate(form.values);
    form.reset();
    onClose();
  }

  function handleDelete(event: MouseEvent<HTMLElement>) {
    deleteProjectMutation.mutate();
    setOpenDeleteModal(false);
    form.reset();
    onClose();
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Edit Project"
        padding="xl"
        size="50%"
      >
        {error && <p>"Try refreshing lol"</p>}
        <form onSubmit={handleSubmit}>
          <TextInput
            data-autofocus
            mt="md"
            required
            label="Name"
            placeholder="Name"
            value={form.values.name}
            onBlur={() => form.values.name !== "" && form.validateField("name")}
            {...form.getInputProps("name")}
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
        title="Delete project"
      >
        <Text size="sm">
          Are you sure you want to delete this project? All linked tasks will be
          deleted. This action is irreversible.
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
            Delete project
          </Button>
        </Center>
      </Modal>
    </>
  );
};
