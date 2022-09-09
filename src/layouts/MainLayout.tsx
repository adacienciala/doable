import { ActionIcon, Anchor, Box, Group, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
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
import { APIClient, Method } from "../api/client";
import { Profile } from "../components/Profile";
import { IUser } from "../models/user";

type Props = {
  page: string;
};

const MainLayout: React.FC<Props> = ({ page, children }) => {
  const client = new APIClient();

  const { data: user } = useQuery<IUser>(
    ["user", localStorage.getItem("doableId")!],
    () => {
      const doableId = localStorage.getItem("doableId")!;
      return client.singleUser(Method.GET, doableId);
    }
  );

  useEffect(() => localStorage.setItem("partyId", user?.partyId ?? ""), [user]);

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
          backgroundImage: `url("/background.png")`,
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
          <Stack
            sx={(theme) => ({
              flexGrow: 3,
              gap: 10,
              alignItems: "center",
            })}
          >
            <Profile user={user} />
            <NavbarLinks />
          </Stack>
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
          <Text>You're doing great, {user?.name}!</Text>
        </Group>
        <Box
          sx={(theme) => ({
            gridArea: "content",
            overflow: "auto",
          })}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
