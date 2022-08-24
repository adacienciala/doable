import { Group, Text } from "@mantine/core";

interface VerticalTabProps {
  title: string;
  range?: string;
  handleClick: any;
}

export const VerticalTab = ({
  title,
  range,
  handleClick,
}: VerticalTabProps) => {
  return (
    <Group
      sx={() => ({
        padding: "10px 40px",
        width: "80px",
        flexDirection: "row",
        gap: "20px",
        borderRight: "1px solid gray",
        whiteSpace: "nowrap",
        alignItems: "flex-start",
        overflow: "visible",
        ":hover": {
          cursor: "pointer",
          backgroundColor: "gray",
        },
      })}
      onClick={handleClick}
    >
      <Group
        style={{
          transformOrigin: "left center",
          flexWrap: "nowrap",
          transform: "rotate(90deg)",
          fontWeight: "bold",
        }}
      >
        <Text>{title}</Text>
        {range && <Text>{range}</Text>}
      </Group>
    </Group>
  );
};
