import {
  ActionIcon,
  Box,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { IoMdHelp } from "react-icons/io";
import ReactJoyride, { CallBackProps, EVENTS } from "react-joyride";
import { APIClient, Method } from "../api/client";
import { NavbarFooter } from "../components/NavbarFooter";
import { NavbarLinks } from "../components/NavbarLinks";
import { Profile } from "../components/Profile";
import { IUser } from "../models/user";
import { socket } from "../utils/chatContext";
import { HeaderContext } from "../utils/headerContext";
import { tutorialSteps } from "../utils/joyride";

type Props = {
  page: string;
};

const MainLayout: React.FC<Props> = ({ page, children }) => {
  const theme = useMantineTheme();
  const client = new APIClient();
  const [headerText] = useContext(HeaderContext);
  const [{ run, steps }, setTour] = useState({
    run: JSON.parse(localStorage.getItem("isNewUser") ?? "false"),
    steps: tutorialSteps[page],
  });

  const { data: user } = useQuery<IUser>(
    ["user", localStorage.getItem("doableId")!],
    () => {
      const doableId = localStorage.getItem("doableId")!;
      return client.singleUser(Method.GET, doableId);
    }
  );

  useEffect(() => localStorage.setItem("partyId", user?.partyId ?? ""), [user]);

  const logOut = () => {
    socket.off();
    socket.disconnect();
    localStorage.clear();
  };

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { type } = data;

    if (type === EVENTS.TOUR_END && run) {
      setTour((prev) => ({ run: false, steps: [...prev.steps] }));
    }
  };

  const fontStyles = {
    color: theme.colors.gray[9],
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSizes.sm,
  };

  return (
    <>
      <ReactJoyride
        continuous
        scrollToFirstStep
        showProgress
        showSkipButton
        disableCloseOnEsc
        disableOverlayClose
        hideCloseButton
        spotlightClicks
        run={run}
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: theme.colors.yellow[6],
            textColor: theme.colors.gray[9],
          },
          buttonNext: {
            borderRadius: theme.radius.sm,
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
            ...fontStyles,
          },
          buttonBack: {
            ...fontStyles,
          },
          buttonSkip: {
            ...fontStyles,
          },
          tooltipContainer: {
            ...fontStyles,
          },
        }}
        callback={handleJoyrideCallback}
      />
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
              gap: 30,
              alignItems: "center",
            })}
          >
            <Profile data-tut="profile" user={user} />
            <NavbarLinks data-tut="nav-links" activePage={page} />
          </Stack>
          <NavbarFooter logOutHandler={logOut} />
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
          <Text>
            {headerText}, {user?.name}
          </Text>
          <ActionIcon
            color="gray.9"
            radius="xl"
            variant="outline"
            onClick={() =>
              setTour((prev) => ({
                run: true,
                steps: [...prev.steps],
              }))
            }
          >
            <IoMdHelp />
          </ActionIcon>
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
