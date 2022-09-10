import { Group, Text } from "@mantine/core";
import { isSameDate } from "@mantine/dates";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface VerticalTabProps {
  title: string;
  range?: { start: Date; end: Date; setStart?: Dispatch<SetStateAction<Date>> };
  handleClick: any;
}

export const VerticalTab = ({
  title,
  range,
  handleClick,
}: VerticalTabProps) => {
  function getDateText() {
    if (!range) return null;
    if (isSameDate(range.start, range.end)) {
      return <Text>{format(range.start, "dd/MM/yyyy")}</Text>;
    }
    return (
      <Text>{`${format(range.start, "dd/MM/yyyy")} - ${format(
        range.end,
        "dd/MM/yyyy"
      )}`}</Text>
    );
  }

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
        {range && getDateText()}
      </Group>
    </Group>
  );
};
