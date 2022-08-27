import { Avatar, Tooltip } from "@mantine/core";

const usersShownNumber = 2;

export const UserCluster = ({ users }: { users: string[] }) => {
  const usersShown = users.slice(0, usersShownNumber);
  const usersHidden =
    users.length > usersShownNumber ? users.slice(usersShownNumber) : null;
  return (
    <>
      <Tooltip.Group openDelay={300} closeDelay={100}>
        <Avatar.Group spacing="sm">
          {usersShown.map((u: string) => (
            <Tooltip key={u} label={u} withArrow>
              <Avatar radius="xl" />
            </Tooltip>
          ))}
          {usersHidden && (
            <Tooltip
              withArrow
              label={usersHidden.map((u: string) => (
                <div>{u}</div>
              ))}
            >
              <Avatar radius="xl">{`+${usersHidden.length}`}</Avatar>
            </Tooltip>
          )}
        </Avatar.Group>
      </Tooltip.Group>
    </>
  );
};
