import { ActionIcon } from "@mantine/core";
import { RiAddFill } from "react-icons/ri";

export const AddButton = ({ onClick }: { onClick: Function }) => (
  <ActionIcon
    color="yellow.6"
    radius="xl"
    variant="outline"
    onClick={() => onClick()}
    size="sm"
  >
    <RiAddFill size={18} />
  </ActionIcon>
);
