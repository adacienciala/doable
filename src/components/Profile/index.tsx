import {
  Avatar,
  Button,
  Center,
  RingProgress,
  Sx,
  Text,
  Tooltip,
} from "@mantine/core";
import avatar from "animal-avatar-generator";
import { useCallback } from "react";
import { IUser } from "../../models/user";

const sizeOptions = {
  lg: {
    ring: { size: 150, thickness: 9 },
    avatar: 90,
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

      <Text size={size} weight={"bold"}>
        {user?.name} {user?.surname}
      </Text>

      <Button
        variant="light"
        sx={() => ({
          borderRadius: 40,
          padding: [10, 20],
        })}
      >
        {user?.statistics.rank}
      </Button>
    </>
  );
};
