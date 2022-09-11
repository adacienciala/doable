import {
  Button,
  Center,
  Drawer,
  Modal,
  NumberInput,
  Select,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import { FormEvent, MouseEvent, useEffect, useState } from "react";
import {
  APIClient,
  Method,
  ProjectExtended,
  TaskExtended,
} from "../../api/client";
import { ITask } from "../../models/task";
import { isValidDate } from "../../utils/utils";

interface TaskEditDrawerProps {
  taskId: string;
  opened: boolean;
  onClose: () => void;
}

export const TaskEditDrawer = ({
  taskId,
  opened,
  onClose,
}: TaskEditDrawerProps) => {
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const {
    isSuccess,
    error,
    data: task,
  } = useQuery<TaskExtended>(
    ["task", taskId],
    async () => {
      const t = await client.singleTask(Method.GET, taskId);
      if (t.date === null) t.date = undefined;
      return t;
    },
    {
      enabled: taskId !== "",
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const { isSuccess: isSuccessProjects, data: projects } = useQuery<
    ProjectExtended[]
  >(["projects"], async () => await client.projects(Method.GET), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const editTaskMutation = useMutation(
    (data: Partial<ITask>) =>
      client.singleTask(Method.PUT, taskId, {
        body: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
      },
    }
  );

  const deleteTaskMutation = useMutation(
    () => client.singleTask(Method.DELETE, taskId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
      },
    }
  );

  const form = useForm<Partial<ITask> & Pick<ITask, "title">>({
    initialValues: {
      title: "",
      description: "",
      xp: 5,
      date: undefined,
      projectId: "",
      repeat: "",
    },
    validate: {
      title: (value: string) => (value.length > 0 ? null : "Enter a title"),
    },
  });

  useEffect(() => {
    if (isSuccess) {
      task.date = new Date(task.date);
      form.setValues({
        title: task.title,
        description: task.description || "",
        xp: task.xp || 5,
        date: isValidDate(task.date) ? task.date : undefined,
        projectId: task.projectId || "",
        repeat: task.repeat || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, task]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }
    editTaskMutation.mutate(form.values);
    form.reset();
    onClose();
  }

  function handleDelete(event: MouseEvent<HTMLElement>) {
    deleteTaskMutation.mutate();
    setOpenDeleteModal(false);
    form.reset();
    onClose();
  }

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Edit Task"
        padding="xl"
        size="50%"
      >
        {error && <p>"Try refreshing lol"</p>}
        <form onSubmit={handleSubmit}>
          <TextInput
            data-autofocus
            mt="md"
            required
            label="Title"
            placeholder="Title"
            value={form.values.title}
            onBlur={() =>
              form.values.title !== "" && form.validateField("title")
            }
            {...form.getInputProps("title")}
          />
          <TextInput
            mt="md"
            label="Description"
            placeholder="Description"
            value={form.values.description}
            {...form.getInputProps("description")}
          />
          <NumberInput
            mt="md"
            label="XP"
            placeholder="XP"
            value={form.values.xp}
            {...form.getInputProps("xp")}
          />
          <DatePicker
            mt="md"
            label="Date"
            placeholder="Date"
            minDate={new Date()}
            dayStyle={(date) =>
              isSameDay(date, new Date()) ? { borderStyle: "dashed" } : null
            }
            value={form.values.date}
            {...form.getInputProps("date")}
          />
          <Select
            mt="md"
            label="Project"
            placeholder="Project"
            data={
              (isSuccessProjects &&
                projects.map((p) => ({
                  value: p.projectId,
                  label: p.name,
                }))) ??
              []
            }
            clearable
            {...form.getInputProps("projectId")}
          />
          <TextInput
            mt="md"
            label="Repeat"
            placeholder="Repeat"
            value={form.values.repeat}
            {...form.getInputProps("repeat")}
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
        title="Delete task"
      >
        <Text size="sm">
          Are you sure you want to delete this task? This action is
          irreversible.
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
            Delete task
          </Button>
        </Center>
      </Modal>
    </>
  );
};
