import { ActionIcon, Anchor, Box, Container, Text } from "@mantine/core";
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

// TODO: change to const
// TODO: change name to & use as layout
function Dashboard({ page }: { page?: string }) {
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
      <>
        {data.map((linkData) => (
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
      </>
    );
  };

  const NavbarFooter = () => {
    return (
      <Box
        sx={(theme) => ({
          display: "fex",
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
      </Box>
    );
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.colors.gray[7],
          display: "grid",
          color: "white",
          gridTemplateRows: "70px auto",
          gridTemplateColumns: "250px auto",
          gridTemplateAreas: `
            "navbar header"
            "navbar content"
            "navbar content"
          `,
        })}
      >
        <Container
          sx={(theme) => ({
            gridArea: "navbar",
            display: "flex",
            backgroundColor: theme.colors.gray[8],
            flexDirection: "column",
            padding: 20,
            gap: 10,
            boxSizing: "border-box",
            width: "100%",
          })}
        >
          <Box
            sx={(theme) => ({
              flexGrow: 3,
            })}
          >
            <Box>First</Box>
            <NavbarLinks />
          </Box>
          <NavbarFooter />
        </Container>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.colors.yellow[6],
            gridArea: "header",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 20,
            color: theme.colors.gray[9],
          })}
        >
          <Text>You're doing great, Katie!</Text>
        </Box>
        <Box
          sx={(theme) => ({
            gridArea: "content",
          })}
        >
          content
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
