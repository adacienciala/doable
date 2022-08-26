import { Avatar, Tooltip } from "@mantine/core";

export const UserCluster = ({ users }: { users: string[] }) => {
  const usersShown = users.slice(0, 3);
  const usersHidden = users.slice(3);
  return (
    <>
      <Tooltip.Group openDelay={300} closeDelay={100}>
        <Avatar.Group spacing="sm">
          {usersShown.map((u: string) => (
            <Tooltip label={u} withArrow>
              <Avatar radius="xl" />
            </Tooltip>
          ))}
          <Tooltip
            withArrow
            label={usersHidden.map((u: string) => (
              <div>{u}</div>
            ))}
          >
            <Avatar radius="xl">+2</Avatar>
          </Tooltip>
        </Avatar.Group>
      </Tooltip.Group>
    </>
  );
};
