import { Stack, Text } from "@mantine/core";
import { Profile } from "../../../components/Profile";
import { IUser } from "../../../models/user";

interface UserStatisticsProps {
  user?: IUser;
}
const UserStatistics = ({ user }: UserStatisticsProps) => {
  return (
    <>
      <Stack style={{ flexBasis: "40%" }}>
        <Text size="xl" weight="bold">
          Statistics
        </Text>
        <Profile size="xl" user={user} />
      </Stack>
    </>
  );
};

export default UserStatistics;
