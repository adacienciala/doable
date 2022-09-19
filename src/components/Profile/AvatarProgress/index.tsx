import { Avatar, Center, RingProgress, Sx, Tooltip } from "@mantine/core";
import avatar from "animal-avatar-generator";
import { useCallback } from "react";
import { IUser } from "../../../models/user";
import { getUserAvatarSeed } from "../../../utils/utils";

const sizeOptionsAvatar = {
  lg: {
    ring: { size: 125, thickness: 7.5 },
    avatar: 75,
  },
  xl: {
    ring: { size: 200, thickness: 12 },
    avatar: 120,
  },
};

export const AvatarProgress = ({
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
  const xp = user?.statistics?.points.xp ?? 0;
  const minXp = user?.statistics?.points.minXp ?? 0;
  const maxXp = user?.statistics?.points.maxXp ?? 100;

  const getCurrentProgress = useCallback(
    () => ((xp - minXp) / (maxXp - minXp)) * 100,
    [xp, minXp, maxXp]
  );
  return (
    <Tooltip.Floating
      // ! new version of mantine should support that but doesn't
      // transition="skew-up"
      // transitionDuration={100}
      // openDelay={500}
      label={`${xp}XP`}
    >
      <RingProgress
        size={sizeOptionsAvatar[size].ring.size}
        thickness={sizeOptionsAvatar[size].ring.thickness}
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
              size={sizeOptionsAvatar[size].avatar}
              src={`data:image/svg+xml;UTF-8,${encodeURIComponent(
                avatar(getUserAvatarSeed(user))
              )}`}
            ></Avatar>
          </Center>
        }
      />
    </Tooltip.Floating>
  );
};
