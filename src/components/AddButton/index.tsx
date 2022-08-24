import { ActionIcon } from "@mantine/core";
import { RiAddFill } from "react-icons/ri";

export const AddButton = ({
  onClick,
  ...props
}: {
  onClick: Function;
  [x: string]: any;
}) => (
  <ActionIcon
    color="yellow.6"
    radius="xl"
    variant="outline"
    onClick={() => onClick()}
    size="sm"
    {...props}
  >
    <RiAddFill size={18} />
  </ActionIcon>
);
