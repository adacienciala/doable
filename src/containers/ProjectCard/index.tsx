import { Card, Group, Image, Menu, Text } from "@mantine/core";
import { RiDeleteBin5Fill, RiEyeFill } from "react-icons/ri";
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
            <Menu.Label>
              <Menu.Item icon={<RiEyeFill size={14} />}>Preview all</Menu.Item>
              <Menu.Item icon={<RiDeleteBin5Fill size={14} />} color="red">
                Delete all
              </Menu.Item>
            </Menu.Label>
          </Menu>
        </Group>

        <Card.Section mt="sm">
          <Image src="https://images.unsplash.com/photo-1579263477001-7a703f1974e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80" />
        </Card.Section>

        <UserCluster users={owners} />
      </Card>
    </>
  );
};
