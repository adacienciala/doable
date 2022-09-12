import { Stack, Table, Text } from "@mantine/core";
import { IUser } from "../../../models/user";

interface UserStatisticsProps {
  user?: IUser;
}
const UserStatistics = ({ user }: UserStatisticsProps) => {
  return (
    <>
      <Stack>
        <Text weight="bold">Points</Text>
        <Table style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th>Individual</th>
              <th>Party</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{user?.statistics.points.xp} XP</td>
              <td>{user?.statistics.party.xp} XP</td>
            </tr>
            <tr>
              <td>{user?.statistics.points.rank}</td>
              <td>Level {user?.statistics.party.level}</td>
            </tr>
          </tbody>
        </Table>
        <Text weight="bold">Tasks</Text>
        <Table style={{ tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Number</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>created</td>
              <td>{user?.statistics.tasks.created}</td>
            </tr>
            <tr>
              <td>current</td>
              <td>{user?.statistics.tasks.current}</td>
            </tr>
            <tr>
              <td>deleted</td>
              <td>{user?.statistics.tasks.deleted}</td>
            </tr>
            <tr>
              <td>finished</td>
              <td>{user?.statistics.tasks.finished}</td>
            </tr>
          </tbody>
        </Table>
      </Stack>
    </>
  );
};

export default UserStatistics;
