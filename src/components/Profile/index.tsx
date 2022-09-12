import {
  Avatar,
  Badge,
  Center,
  RingProgress,
  Stack,
  Sx,
  Text,
  Tooltip,
} from "@mantine/core";
import avatar from "animal-avatar-generator";
import { useCallback } from "react";
import { IUser } from "../../models/user";

import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";
import { getUserAvatarSeed } from "../../utils/utils";

const sizeOptions = {
  lg: {
    ring: { size: 125, thickness: 7.5 },
    avatar: 75,
  },
  xl: {
    ring: { size: 200, thickness: 12 },
    avatar: 120,
  },
};

export const Profile = ({
  user,
  sx,
  size = "xl",
}: {
  user?: IUser;
  sx?: Sx;
  size?: "lg" | "xl";
}) => {
  const xp = user?.statistics?.points.xp ?? 0;
  const minXp = user?.statistics?.points.minXp ?? 0;
  const maxXp = user?.statistics?.points.maxXp ?? 100;

  const getCurrentProgress = useCallback(
    () => ((xp - minXp) / (maxXp - minXp)) * 100,
    [xp, minXp, maxXp]
  );

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
        })}
      >
        <Tooltip.Floating
          // ! new version of mantine should support that but doesn't
          // transition="skew-up"
          // transitionDuration={100}
          // openDelay={500}
          label={`${xp}XP`}
        >
          <RingProgress
            size={sizeOptions[size].ring.size}
            thickness={sizeOptions[size].ring.thickness}
            roundCaps
            sections={[
              {
                value: getCurrentProgress(),
                color: "yellow",
              },
            ]}
            sx={[
              (theme) => ({
                "circle:first-of-type": {
                  stroke: theme.colors.gray[7],
                },
              }),
              sx,
            ]}
            label={
              <Center>
                <Avatar
                  size={sizeOptions[size].avatar}
                  src={`data:image/svg+xml;UTF-8,${encodeURIComponent(
                    avatar(getUserAvatarSeed(user))
                  )}`}
                ></Avatar>
              </Center>
            }
          />
        </Tooltip.Floating>

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
