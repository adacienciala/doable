import {
  Button,
  Center,
  Drawer,
  NumberInput,
  Select,
  Space,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import { FormEvent, useEffect } from "react";
import { APIClient, Method, ProjectExtended } from "../../api/client";
import { TaskData } from "../../components/TaskPill";
import { ITask } from "../../models/task";

interface TaskAddDrawerProps {
  data: Partial<TaskData>;
  opened: boolean;
  onClose: () => void;
}

export const TaskAddDrawer = ({
  data,
  opened,
  onClose,
}: TaskAddDrawerProps) => {
  const client = new APIClient();
  const queryClient = useQueryClient();

  const addTaskMutation = useMutation(
    (data: Partial<ITask>) =>
      client.tasks(Method.POST, {
        body: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
      },
    }
  );

  const { isSuccess, data: projects } = useQuery<ProjectExtended[]>(
    ["projects"],
    async () => await client.projects(Method.GET),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
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

  const handleClose = () => {
    form.reset();
    onClose();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.validate()) {
      return;
    }
    addTaskMutation.mutate(form.values);
    form.reset();
    onClose();
  }

  useEffect(() => {
    form.setValues({
      title: "",
      description: "",
      xp: 5,
      date: data.date ?? undefined,
      projectId: data.projectId ?? "",
      repeat: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleClose}
        title="Create Task"
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
              (isSuccess &&
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
