import {
  Box,
  Button,
  Center,
  Drawer,
  Group,
  SegmentedControl,
  Select,
  Space,
  Text,
  TextInput,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSameDay } from "date-fns";
import { FormEvent, useEffect, useState } from "react";
import { APIClient, Method, ProjectExtended } from "../../api/client";
import { TaskData } from "../../components/TaskPill";
import { ITask } from "../../models/task";
import { getRandomDifficultyComment } from "../../utils/utils";

interface TaskAddDrawerProps {
  data: Partial<TaskData>;
  opened: boolean;
  onClose: () => void;
}

export const taskDifficultiesSelect = [
  {
    value: "easy",
    label: (
      <Center sx={(theme) => ({ color: theme.colors.green[6] })}>
        🙂
        <Box ml={10}>easy</Box>
      </Center>
    ),
  },
  {
    value: "medium",
    label: (
      <Center sx={(theme) => ({ color: theme.colors.yellow[6] })}>
        😁
        <Box ml={10}>medium</Box>
      </Center>
    ),
  },
  {
    value: "hard",
    label: (
      <Center sx={(theme) => ({ color: theme.colors.red[6] })}>
        🤯
        <Box ml={10}>hard</Box>
      </Center>
    ),
  },
];

export const difficultyComments = {
  easy: [
    "Easy, fast and fun?",
    "Should be quick...",
    "That's a piece of cake!",
  ],
  medium: [
    "Are you sure you can do this?",
    "It's going to take a bit...",
    "Okay, let's do this!",
  ],
  hard: [
    "Maybe you should break it down?",
    "This sounds tough...",
    "A bit of a tough cookie, isn't it?",
    "Ha, good luck with that!",
  ],
};

export const TaskAddDrawer = ({
  data,
  opened,
  onClose,
}: TaskAddDrawerProps) => {
  const client = new APIClient();
  const queryClient = useQueryClient();
  const [difficultyComment, setDifficultyComment] = useState("");

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
      difficulty: "easy",
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
    setDifficultyComment("");
    onClose();
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.validate().hasErrors) {
      return;
    }
    addTaskMutation.mutate(form.values);
    form.reset();
    setDifficultyComment("");
    onClose();
  }

  useEffect(() => {
    setDifficultyComment(
      getRandomDifficultyComment(data?.difficulty || "easy")
    );
    form.setValues({
      title: "",
      description: "",
      difficulty: data.difficulty || "easy",
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
        data-tut="add-task-drawer"
      >
        <form
          onSubmit={handleSubmit}
          onChange={(e) => {
            const target = e.target as HTMLInputElement;
            if (target.name === "Difficulty") {
              setDifficultyComment(getRandomDifficultyComment(target.value));
            }
          }}
        >
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
          <Group position="apart">
            <Text mt="md" size={"sm"} weight={500}>
              Difficulty
            </Text>
            <Text mt="md" size={"sm"}>
              {difficultyComment}
            </Text>
          </Group>
          <SegmentedControl
            fullWidth
            placeholder="Difficulty"
            label="Difficulty"
            input="Difficulty"
            description="Difficulty"
            name="Difficulty"
            data={taskDifficultiesSelect}
            {...form.getInputProps("difficulty")}
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
