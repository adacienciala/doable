import {
  Avatar,
  Badge,
  Center,
  RingProgress,
  Sx,
  Text,
  Tooltip,
} from "@mantine/core";
import avatar from "animal-avatar-generator";
import { useCallback } from "react";
import { IUser } from "../../models/user";

import { GiRank1, GiRank2, GiRank3 } from "react-icons/gi";

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
  const xp = user?.statistics?.xp ?? 0;
  const minXp = user?.statistics?.minXp ?? 0;
  const maxXp = user?.statistics?.maxXp ?? 100;

  const getCurrentProgress = useCallback(
    () => ((xp - minXp) / (maxXp - minXp)) * 100,
    [xp, minXp, maxXp]
  );

  function getUserSeed() {
    return user?.settings?.avatarSeed || user?.email || "default";
  }

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
                  avatar(getUserSeed())
                )}`}
              ></Avatar>
            </Center>
          }
        />
      </Tooltip.Floating>

      <Text
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
        leftSection={getRankBadgeIcon(user?.statistics.rank)}
      >
        {user?.statistics.rank}
      </Badge>
    </>
  );
};
