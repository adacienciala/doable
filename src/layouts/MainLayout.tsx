import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import ReactJoyride from "react-joyride";
import { APIClient, Method } from "../api/client";
import { NavbarFooter } from "../components/NavbarFooter";
import { NavbarLinks } from "../components/NavbarLinks";
import { Profile } from "../components/Profile";
import { IUser } from "../models/user";
import { socket } from "../utils/chatContext";
import { HeaderContext } from "../utils/headerContext";

type Props = {
  page: string;
};

const MainLayout: React.FC<Props> = ({ page, children }) => {
  const client = new APIClient();
  const [headerText] = useContext(HeaderContext);
  const [{ run, steps }, setSteps] = useState({
    run: false,
    steps: [
      {
        target: "#first",
        content: "This is my awesome feature!",
      },
      {
        target: "#second",
        content: "This another awesome  secondfeature!",
      },
    ],
  });

  const { data: user } = useQuery<IUser>(
    ["user", localStorage.getItem("doableId")!],
    () => {
      const doableId = localStorage.getItem("doableId")!;
      return client.singleUser(Method.GET, doableId);
    }
  );

  useEffect(() => localStorage.setItem("partyId", user?.partyId ?? ""), [user]);

  function logOut() {
    socket.off();
    socket.disconnect();
    localStorage.clear();
  }

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
            <Profile id="first" user={user} />
            <NavbarLinks activePage={page} />
          </Stack>
          <NavbarFooter logOutHandler={logOut} />
          <Button
            onClick={() =>
              setSteps((prev) => ({
                run: true,
                steps: [...prev.steps],
              }))
            }
            size="lg"
            variant="white"
          >
            Start
          </Button>
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
          id="second"
        >
          <Text>
            {headerText}, {user?.name}
          </Text>
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
      <ReactJoyride
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
    </>
  );
};

export default MainLayout;
