import { Box, Group, Stack } from "@mantine/core";
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
        <Box
          sx={{
            backgroundColor: "yellow",
            borderRadius: "10px",
            width: "40px",
          }}
        ></Box>
      </Group>
    </>
  );
};
