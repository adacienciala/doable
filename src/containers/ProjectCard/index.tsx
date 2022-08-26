import { ActionIcon, Card, Group, Image, Menu, Text } from "@mantine/core";
import { RiDeleteBin5Fill, RiEyeFill, RiMore2Fill } from "react-icons/ri";
import { UserCluster } from "../UserCluster";

export const ProjectCard = ({
  name,
  owners,
}: {
  name: string;
  owners: string[];
}) => {
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
              <Menu.Item icon={<RiEyeFill size={14} />}>Preview all</Menu.Item>
              <Menu.Item icon={<RiDeleteBin5Fill size={14} />} color="red">
                Delete all
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Card.Section mt="sm">
          <Image src="https://images.unsplash.com/photo-1579263477001-7a703f1974e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" />
        </Card.Section>

        <Card.Section inheritPadding mt="sm" pb="md">
          <UserCluster users={owners} />
        </Card.Section>
      </Card>
    </>
  );
};
