import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Center,
  FloatingTooltip,
  Group,
  RingProgress,
  Text,
} from "@mantine/core";
import avatar from "animal-avatar-generator";
import { useEffect, useState } from "react";
import { AiOutlineProject } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import {
  RiCompass3Line,
  RiHome5Line,
  RiLogoutCircleLine,
  RiMedalLine,
  RiSettings2Line,
} from "react-icons/ri";
import { Link } from "react-router-dom";

type Props = {
  page: string;
};

const MainLayout: React.FC<Props> = ({ page, children }) => {
  const user = JSON.parse(localStorage.getItem("user")!); // TODO: state in the future

  function logOut() {
    localStorage.clear();
  }

  const NavbarLinks = () => {
    const data = [
      {
        text: "dashboard",
        icon: RiHome5Line,
        to: "/",
      },
      {
        text: "projects",
        icon: AiOutlineProject,
        to: "/projects",
      },
      {
        text: "calendar",
        icon: FiCalendar,
        to: "/calendar",
      },
      {
        text: "party",
        icon: RiCompass3Line,
        to: "/party",
      },
      {
        text: "rewards",
        icon: RiMedalLine,
        to: "/rewards",
      },
    ];

    return (
      <Box style={{ alignSelf: "flex-start" }}>
        {data.map((linkData, idx) => (
          <Anchor
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginTop: 20,
              fontWeight: "bold",
              color:
                page === linkData.text.toLowerCase()
                  ? theme.colors.yellow[6]
                  : "white",
            })}
            component={Link}
            to={linkData.to}
            key={idx}
          >
            {linkData.icon({
              size: 30,
            })}
            <Text
              sx={(theme) => ({
                display: "inline-block",
                textTransform: "uppercase",
                textDecoration: "none",
              })}
            >
              {linkData.text}
            </Text>
          </Anchor>
        ))}
      </Box>
    );
  };

  function getUserSeed() {
    return user.settings?.avatarSeed || user.email || "default";
  }

  const NavbarFooter = () => {
    return (
      <Group
        sx={(theme) => ({
          width: "100%",
          justifyContent: "space-between",
          gridArea: "navbar",
        })}
      >
        <ActionIcon size={30} component={Link} to="/" onClick={logOut}>
          <RiLogoutCircleLine size={30} />
        </ActionIcon>
        <ActionIcon size={30} component={Link} to="/settings">
          <RiSettings2Line size={30} />
        </ActionIcon>
      </Group>
    );
  };

  const NavbarProfile = () => {
    const [xp, setXp] = useState(user?.statistics?.xp || 0);
    const [maxXp, setMaxXp] = useState(user?.statistics?.maxXp || 100);

    useEffect(() => {
      setXp(user?.statistics?.xp || 0);
      setMaxXp(user?.statistics?.maxXp || 100);
    }, []);

    return (
      <>
        <FloatingTooltip
          transition="skew-up"
          transitionDuration={100}
          openDelay={500}
          label={`${xp}/${maxXp}`}
        >
          <RingProgress
            size={200}
            thickness={12}
            roundCaps
            sections={[
              {
                value: (xp / maxXp) * 100,
                color: "yellow",
              },
            ]}
            sx={(theme) => ({
              "circle:first-of-type": {
                stroke: theme.colors.gray[7],
              },
            })}
            label={
              <Center>
                <Avatar
                  size={120}
                  src={`data:image/svg+xml;UTF-8,${encodeURIComponent(
                    avatar(getUserSeed())
                  )}`}
                ></Avatar>
              </Center>
            }
          />
        </FloatingTooltip>

        <Text size="xl" weight={"bold"}>
          {user.name} {user.surname}
        </Text>

        <Button
          variant="light"
          sx={() => ({
            borderRadius: 40,
            padding: [10, 20],
          })}
        >
          {user.statistics.rank}
        </Button>
      </>
    );
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          display: "grid",
          color: "white",
          gridTemplateRows: "70px auto",
          gridTemplateColumns: "250px auto",
          gridTemplateAreas: `
            "navbar header"
            "navbar content"
            "navbar content"
          `,
          backgroundImage: "url(./background.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        })}
      >
        <Group
          sx={(theme) => ({
            gridArea: "navbar",
            backgroundColor: theme.colors.gray[8],
            flexDirection: "column",
            padding: 20,
            boxSizing: "border-box",
            width: "100%",
          })}
        >
          <Group
            sx={(theme) => ({
              flexGrow: 3,
              gap: 10,
              alignItems: "center",
              flexDirection: "column",
            })}
          >
            <NavbarProfile />
            <NavbarLinks />
          </Group>
          <NavbarFooter />
        </Group>
        <Group
          sx={(theme) => ({
            backgroundColor: theme.colors.yellow[6],
            gridArea: "header",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            color: theme.colors.gray[9],
          })}
        >
          <Text>You're doing great, {user.name}!</Text>
        </Group>
        <Box
          sx={(theme) => ({
            gridArea: "content",
          })}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;