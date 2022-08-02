import { Checkbox, Group, Text } from "@mantine/core";
import { CalendarView } from "../../pages/Calendar";

export interface TaskData {
  title: string;
  description: string;
  date: Date;
}

interface TaskPillProps {
  data: TaskData;
  view: CalendarView;
}

export const TaskPill = ({
  data: { title, description, date },
  view,
}: TaskPillProps) => {
  return (
    <Group
      position="apart"
      noWrap
      sx={(theme) => ({
        backgroundColor: "white",
        color: theme.colors.gray[7],
        marginBottom: "20px",
        padding: "10px",
        borderRadius: "10px",
        cursor: "grab",
      })}
    >
      <Checkbox radius="xl" />
      <Text weight={500}>{title}</Text>
      {view === "today" && <Text weight={300}>{description}</Text>}
      {/* <Text weight={300}>{format(date, "dd/MM/yyyy")}</Text> */}
    </Group>
  );
};
