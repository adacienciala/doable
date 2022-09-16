import { Avatar, Group, Stack, Text } from "@mantine/core";
import avatar from "animal-avatar-generator";
import { format } from "date-fns";
import { IMessage } from "../../models/message";
import { IUser } from "../../models/user";

export const Message = ({
  message,
  user,
}: {
  message: IMessage;
  user?: IUser;
}) => (
  <Stack>
    <Group>
      <Avatar
        size="md"
        src={
          user
            ? `data:image/svg+xml;UTF-8,${encodeURIComponent(
                avatar(user?.settings.avatarSeed)
              )}`
            : undefined
        }
      />
      <div>
        <Text size="sm">
          {user ? `${user.name} ${user.surname}` : "Unknown user"}
        </Text>
        <Text size="xs">{format(message.date, "d MMM y, h:mm aa")}</Text>
      </div>
    </Group>
    <Text size="sm">{message.message}</Text>
  </Stack>
);
