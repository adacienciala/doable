import { Group, Stack, Text } from "@mantine/core";
import { Profile } from "../../../components/Profile";
import { IUser } from "../../../models/user";

export const PartyMemberProfile = ({ user }: { user?: IUser }) => {
  return (
    <>
      <Group noWrap align="stretch">
        <Stack
          sx={(theme) => ({
            gap: 0,
            alignItems: "center",
          })}
        >
          <Profile
            size="lg"
            user={user}
            sx={(theme) => ({
              "circle:first-of-type": {
                stroke: theme.colors.gray[8],
              },
            })}
          />
        </Stack>
        <Stack
          align="center"
          sx={(theme) => ({
            backgroundColor: theme.colors.gray[0],
            borderRadius: "10px",
            width: "40px",
            paddingTop: "10px",
          })}
        >
          <Text weight="bold" color="black">
            {Math.floor(Math.random() * 10)}
          </Text>
        </Stack>
      </Group>
    </>
  );
};
