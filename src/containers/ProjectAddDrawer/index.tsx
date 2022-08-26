import { Button, Center, Drawer, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormEvent } from "react";
import { APIClient, Method } from "../../api/client";
import { IProject } from "../../models/project";

interface ProjectAddDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export const ProjectAddDrawer = ({
  opened,
  onClose,
}: ProjectAddDrawerProps) => {
  const client = new APIClient();
  const queryClient = useQueryClient();

  const addProjectMutation = useMutation(
    (data: Partial<IProject>) =>
      client.projects(Method.POST, {
        body: data,
      }),
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
      name: (value: string) => value.length > 0,
    },
    initialErrors: {
      title: "Please, enter a name",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }
    addProjectMutation.mutate(form.values);
    form.reset();
    onClose();
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Create Project"
        padding="xl"
        size="50%"
      >
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
            label="Cover"
            placeholder="Cover"
            value={form.values.cover}
            {...form.getInputProps("cover")}
          />
          <Center style={{ height: "100px" }}>
            <Button variant="outline" color={"red"} onClick={onClose}>
              Cancel
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
    </>
  );
};
