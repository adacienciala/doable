import { Badge, Stack, Sx, Text } from "@mantine/core";
import { IUser } from "../../models/user";

import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { AvatarProgress } from "./AvatarProgress";

export const Profile = ({
  user,
  sx,
  size = "xl",
  ...props
}: {
  user?: IUser;
  sx?: Sx;
  size?: "lg" | "xl";
  [x: string]: any;
}) => {
  const navigate = useNavigate();

  function getRankBadgeIcon(rank?: string) {
    if (!rank) return "";
    switch (rank!.toLowerCase()) {
      case "private":
        return <GiRank1 />;
      case "corporal":
        return <GiRank2 />;
      default:
        return <GiRank3 />;
    }
  }

  return (
    <>
      <Stack
        sx={(theme) => ({
          gap: 0,
          alignItems: "center",
          cursor: "pointer",
        })}
        onClick={() =>
          navigate(`/profile/${user?.doableId}`, { replace: false })
        }
        {...props}
      >
        <AvatarProgress user={user} sx={sx} size={size} {...props} />
        <Text
          align="center"
          style={{ whiteSpace: size === "lg" ? "nowrap" : "normal" }}
          size={size}
          weight={"bold"}
        >
          {user?.name} {user?.surname}
        </Text>

        <Badge
          variant="light"
          styles={(theme) => ({
            root: {
              cursor: "pointer",
            },
            leftSection: {
              display: "flex",
              alignItems: "center",
            },
          })}
          size={size}
          leftSection={getRankBadgeIcon(user?.statistics.points.rank)}
        >
          {user?.statistics.points.rank}
        </Badge>
      </Stack>
    </>
  );
};
