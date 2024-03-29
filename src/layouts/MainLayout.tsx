import { ActionIcon, Box, Group, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  Children,
  cloneElement,
  isValidElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IoMdHelp } from "react-icons/io";
import { APIClient, Method } from "../api/client";
import { NavbarFooter } from "../components/NavbarFooter";
import { NavbarLinks } from "../components/NavbarLinks";
import { Profile } from "../components/Profile";
import { IReward } from "../models/rewards";
import { IUser } from "../models/user";
import { ChatContext } from "../utils/chatContext";
import { HeaderContext } from "../utils/headerContext";

type Props = {
  page: string;
  noTour?: boolean;
};

const MainLayout: React.FC<Props> = ({ page, noTour, children }) => {
  const client = new APIClient();
  const [headerText] = useContext(HeaderContext);
  const [, , setLoggedIn] = useContext(ChatContext);
  const [tourStart, setTourStart] = useState(false);

  const { data } = useQuery<{ user: IUser; rewards: IReward[] }>(
    ["user", localStorage.getItem("doableId")!],
    () => {
      const doableId = localStorage.getItem("doableId")!;
      return client.singleUser(Method.GET, doableId);
    }
  );

  const user = data?.user;

  useEffect(() => localStorage.setItem("partyId", user?.partyId ?? ""), [user]);

  const logOut = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  const childrenWithProps = useMemo(() => {
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement<any>(child, { tourStart, setTourStart });
      }
      return child;
    });
  }, [children, tourStart]);

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
              gap: 30,
              alignItems: "center",
            })}
          >
            <Profile data-tut="profile" user={user} />
            <NavbarLinks partyId={user?.partyId} activePage={page} />
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
          {!noTour && user?.partyId && (
            <ActionIcon
              color="gray.9"
              radius="xl"
              variant="outline"
              onClick={() => setTourStart(true)}
            >
              <IoMdHelp />
            </ActionIcon>
          )}
        </Group>
        <Box
          sx={(theme) => ({
            gridArea: "content",
            overflow: "hidden",
          })}
        >
          {childrenWithProps}
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
