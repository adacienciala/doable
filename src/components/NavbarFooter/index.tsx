import { ActionIcon, Group } from "@mantine/core";
import { RiLogoutCircleLine, RiSettings2Line } from "react-icons/ri";
import { Link } from "react-router-dom";

export const NavbarFooter = ({
  logOutHandler,
}: {
  logOutHandler: () => void;
}) => {
  return (
    <Group
      sx={(theme) => ({
        width: "100%",
        justifyContent: "space-between",
        gridArea: "navbar",
      })}
    >
      <ActionIcon size={30} component={Link} to="/" onClick={logOutHandler}>
        <RiLogoutCircleLine size={30} />
      </ActionIcon>
      <ActionIcon size={30} component={Link} to="/settings">
        <RiSettings2Line size={30} />
      </ActionIcon>
    </Group>
  );
};
