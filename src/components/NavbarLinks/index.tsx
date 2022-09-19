import { Anchor, Stack, Text } from "@mantine/core";
import { AiOutlineProject } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { RiCompass3Line, RiHome5Line, RiMedalLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export const NavbarLinks = ({
  activePage,
  ...props
}: {
  activePage: string;
  [x: string]: any;
}) => {
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
      text: "challenges",
      icon: RiMedalLine,
      to: "/challenges",
    },
  ];

  return (
    <Stack style={{ gap: 20, alignSelf: "flex-start" }} {...props}>
      {data.map((linkData, idx) => (
        <Anchor
          sx={(theme) => ({
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: "bold",
            color:
              activePage === linkData.text.toLowerCase()
                ? theme.colors.yellow[6]
                : "white",
          })}
          component={Link}
          to={linkData.to}
          key={idx}
          data-tut={linkData.text}
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
    </Stack>
  );
};
