import {
  ActionIcon,
  Card,
  Group,
  Image,
  Menu,
  RingProgress,
  Text,
} from "@mantine/core";
import { useCallback } from "react";
import { RiDeleteBin5Fill, RiMore2Fill, RiSettings2Fill } from "react-icons/ri";
import { IProject } from "../../models/project";
import { UserCluster } from "../UserCluster";

export interface ProjectData extends IProject {}

export const ProjectCard = ({
  data: { name, owner, cover, historyTasksNumber, currentTasksNumber },
}: {
  data: ProjectData;
}) => {
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
      return <Image height="150px" src={cover} />;
    }
    return (
      <RingProgress
        size={150}
        thickness={12}
        roundCaps
        sections={[{ value: getCurrentProgress(), color: getCurrentColor() }]}
        sx={(theme) => ({
          "circle:first-of-type": {
            stroke: theme.colors.gray[7],
          },
          margin: "auto",
        })}
        label={
          <Text color={getCurrentColor()} weight={700} align="center" size="xl">
            {`${getCurrentProgress()}%`}
          </Text>
        }
      />
    );
  }, [getCurrentProgress, getCurrentColor, cover]);

  return (
    <>
      <Card withBorder shadow="sm" radius="md">
        <Group position="apart">
          <Text weight={500}>{name}</Text>
          <Menu withinPortal position="bottom" shadow="sm">
            <Menu.Target>
              <ActionIcon>
                <RiMore2Fill size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<RiSettings2Fill size={14} />}>Edit</Menu.Item>
              <Menu.Item icon={<RiDeleteBin5Fill size={14} />} color="red">
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Card.Section mt="sm">{getCoverImage()}</Card.Section>

        <Card.Section inheritPadding mt="sm" pb="md">
          <UserCluster users={owner} />
        </Card.Section>
      </Card>
    </>
  );
};
