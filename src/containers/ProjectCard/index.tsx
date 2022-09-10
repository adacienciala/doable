import {
  ActionIcon,
  Card,
  createStyles,
  Group,
  Image,
  Menu,
  RingProgress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { MouseEventHandler, useCallback } from "react";
import { RiDeleteBin5Fill, RiMore2Fill, RiSettings2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { ProjectExtended } from "../../api/client";
import { IProject } from "../../models/project";
import { UserCluster } from "../UserCluster";

export const projectCardStyles = createStyles((theme) => ({
  card: {
    minWidth: "230px",
    backgroundColor: theme.colors.gray[0],
    color: theme.colors.gray[9],
    ":hover": {
      backgroundColor: theme.colors.gray[1],
      cursor: "pointer",
    },
  },
}));

const sizeOptions = {
  lg: {
    ring: { size: 100, thickness: 8 },
    card: { height: "220px" },
    cover: { size: "100px" },
    progressText: { size: 15 },
  },
  xl: {
    ring: { size: 150, thickness: 12 },
    card: { height: "280px" },
    cover: { size: "150px" },
    progressText: { size: 20 },
  },
};

export interface ProjectData extends IProject {}

export const ProjectCard = ({
  data: {
    projectId,
    name,
    owner,
    party,
    cover,
    historyTasksNumber,
    currentTasksNumber,
  },
  onEditProject,
  onDeleteProject,
  size = "xl",
}: {
  data: ProjectExtended;
  onEditProject: MouseEventHandler<HTMLButtonElement>;
  onDeleteProject: MouseEventHandler<HTMLButtonElement>;
  size?: "lg" | "xl";
}) => {
  const navigate = useNavigate();
  const { classes } = projectCardStyles();

  const getCurrentProgress = useCallback(
    () =>
      historyTasksNumber !== 0
        ? Math.floor(
            ((historyTasksNumber - currentTasksNumber) / historyTasksNumber) *
              100
          )
        : 0,
    [currentTasksNumber, historyTasksNumber]
  );

  const getCurrentColor = useCallback(() => {
    const progress = getCurrentProgress();
    if (progress < 50) return "red";
    if (progress < 60) return "orange.5";
    if (progress < 90) return "yellow";
    return "green";
  }, [getCurrentProgress]);

  const getCoverImage = useCallback(() => {
    if (cover) {
      return (
        <Image
          withPlaceholder
          height={sizeOptions[size].cover.size}
          src={cover}
        />
      );
    }

    if (historyTasksNumber === 0)
      return (
        <Stack style={{ height: "100%" }} align="center" justify="center">
          <Title>No</Title>
          <Title>Tasks</Title>
        </Stack>
      );

    return (
      <RingProgress
        size={sizeOptions[size].ring.size}
        thickness={sizeOptions[size].ring.thickness}
        roundCaps
        sections={[{ value: getCurrentProgress(), color: getCurrentColor() }]}
        sx={(theme) => ({
          "circle:first-of-type": {
            stroke: theme.colors.gray[4],
          },
          margin: "auto",
        })}
        label={
          <Text
            color={getCurrentColor()}
            weight={700}
            align="center"
            size={size}
          >
            {`${getCurrentProgress()}%`}
          </Text>
        }
      />
    );
  }, [historyTasksNumber, getCurrentProgress, getCurrentColor, cover, size]);

  return (
    <>
      <Card
        withBorder
        shadow="sm"
        radius="md"
        sx={() => ({ height: sizeOptions[size].card.height })}
        className={classes.card}
      >
        <Group position="apart">
          <Text weight={500}>{name}</Text>
          <Menu withinPortal position="bottom" shadow="sm">
            <Menu.Target>
              <ActionIcon color="gray.9">
                <RiMore2Fill size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={onEditProject}
                icon={<RiSettings2Fill size={14} />}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                onClick={onDeleteProject}
                icon={<RiDeleteBin5Fill size={14} />}
                color="red"
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Card.Section
          onClick={() => navigate(`/projects/${projectId}`, { replace: false })}
          style={{
            height: sizeOptions[size].cover.size,
          }}
          mt="sm"
        >
          {getCoverImage()}
        </Card.Section>

        <Card.Section inheritPadding mt="sm" pb="md">
          <Group position="apart">
            <UserCluster users={{ owner, party }} />
            {cover && (
              <Text
                color={getCurrentColor()}
                weight={700}
                align="center"
                size={sizeOptions[size].progressText.size}
              >
                {`${getCurrentProgress()}%`}
              </Text>
            )}
          </Group>
        </Card.Section>
      </Card>
    </>
  );
};
