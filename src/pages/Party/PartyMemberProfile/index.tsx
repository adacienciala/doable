import { Group, Stack, Text } from "@mantine/core";
import { Profile } from "../../../components/Profile";
import { IUser } from "../../../models/user";

export const PartyMemberProfile = ({ user }: { user?: IUser }) => {
  const isUser = user?.doableId === localStorage.getItem("doableId")!;
  return (
    <>
      <Group
        noWrap
        align="stretch"
        {...(isUser ? { "data-tut": "party-profile" } : {})}
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
            {user?.statistics.party.level}
          </Text>
        </Stack>
      </Group>
    </>
  );
};
