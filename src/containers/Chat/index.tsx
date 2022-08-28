import { Avatar, Group, Stack, Text } from "@mantine/core";
import avatar from "animal-avatar-generator";
import { format } from "date-fns";
import { useState } from "react";
import { IUser } from "../../models/user";

const chatMessages = [
  {
    date: new Date("2020-08-10 14:13"),
    message: "In hac habitasse platea dictumst. Fusce ut viverra lectus.",
  },
  {
    date: new Date("2020-08-10 15:13"),
    message: "Anim ea esse cillum nulla magna minim ea esse.",
  },
  {
    date: new Date("2020-08-10 16:13"),
    message: "Do sint proident in ad eu nisi officia aute.",
  },
  {
    date: new Date("2020-08-11 14:13"),
    message: "Pariatur consectetur ea veniam ullamco irure ex in id duis.",
  },
  {
    date: new Date("2020-08-12 15:13"),
    message:
      "Et ad fugiat aute laborum eiusmod voluptate ullamco dolor ad exercitation.",
  },
  {
    date: new Date("2020-09-02 14:13"),
    message: "Elit pariatur nisi adipisicing tempor cillum et veniam tempor.",
  },
  {
    date: new Date("2020-09-12 14:13"),
    message: "Cupidatat proident officia labore minim nostrud.",
  },
];

export const Chat = ({ users }: { users: IUser[] }) => {
  const [loaded, setLoaded] = useState(true);
  if (users.length > chatMessages.length) setLoaded(false);

  return (
    <Stack
      sx={(theme) => ({
        borderRadius: "10px",
        padding: "20px",
        borderStyle: "solid",
        borderColor: theme.colors.yellow[6],
        borderWidth: "1px",
        justifyContent: "center",
      })}
    >
      {loaded ? (
        users.map((user, idx) => (
          <Stack key={idx}>
            <Group>
              <Avatar
                size="md"
                src={`data:image/svg+xml;UTF-8,${encodeURIComponent(
                  avatar(user.settings.avatarSeed)
                )}`}
              ></Avatar>
              <div>
                <Text size="sm">
                  {user.name} {user.surname}
                </Text>
                <Text size="xs">
                  {format(chatMessages[idx].date, "d MMM y, h:mm aa")}
                </Text>
              </div>
            </Group>
            <Text size="sm">{chatMessages[idx].message}</Text>
          </Stack>
        ))
      ) : (
        <Text>Could not load messages</Text>
      )}
    </Stack>
  );
};
