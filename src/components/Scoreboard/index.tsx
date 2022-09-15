import {
  Avatar,
  Center,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import avatar from "animal-avatar-generator";
import { RiTeamFill } from "react-icons/ri";
import { IUser } from "../../models/user";
import { getUserAvatarSeed } from "../../utils/utils";

export const Scoreboard = ({
  users,
  ...props
}: {
  users: IUser[];
  [x: string]: any;
}) => {
  const doableId = localStorage.getItem("doableId")!;

  return (
    <>
      <Stack
        sx={(theme) => ({
          borderRadius: "10px",
          height: "50%",
          overflow: "hidden",
          borderStyle: "solid",
          gap: 0,
          borderColor: theme.colors.yellow[6],
        })}
        {...props}
      >
        <Group
          position="apart"
          sx={(theme) => ({
            backgroundColor: theme.colors.yellow[6],
            padding: "20px",
            color: "black",
          })}
        >
          <Text>Scoreboard</Text>
          <RiTeamFill size={20} />
        </Group>
        <ScrollArea type="hover">
          <Table style={{ tableLayout: "fixed", color: "white" }}>
            <tbody>
              {users
                .sort(
                  (u1, u2) => u2.statistics.points.xp - u1.statistics.points.xp
                )
                .map((u, idx) => (
                  <tr
                    key={u.doableId}
                    style={{
                      backgroundColor:
                        u.doableId === doableId
                          ? "rgba(220, 220, 220, 0.2)"
                          : undefined,
                    }}
                  >
                    <td width="50px">
                      <Center>
                        <Text weight="bold">{idx + 1}</Text>
                      </Center>
                    </td>
                    <td width="50px">
                      <Center>
                        <Avatar
                          size={40}
                          src={`data:image/svg+xml;UTF-8,${encodeURIComponent(
                            avatar(getUserAvatarSeed(u))
                          )}`}
                        ></Avatar>
                      </Center>
                    </td>
                    <td>
                      <Text weight="bold">{`${u.name} ${u.surname}`}</Text>
                    </td>
                    <td width="80px">{u.statistics.points.xp} XP</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </ScrollArea>
      </Stack>
    </>
  );
};
