import { Box, Checkbox, Group, Text } from "@mantine/core";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useState } from "react";

type CalendarView = "today" | "week" | "no-date";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");
  const [tasks, setTasks] = useState([
    {
      title: "title1",
      description: "Some description 1",
      date: new Date(Date.UTC(2022, 6, 12)),
    },
    {
      title: "title2",
      description: "Some description 2",
      date: new Date(Date.UTC(2022, 6, 13)),
    },
    {
      title: "title3",
      description: "Some description 3",
      date: new Date(Date.UTC(2022, 6, 12)),
    },
  ]);

  interface TaskPillProps {
    data: {
      title: string;
      description: string;
      date: Date;
    };
  }

  const TaskPill = ({ data: { title, description, date } }: TaskPillProps) => {
    return (
      <Group
        position="apart"
        noWrap
        sx={(theme) => ({
          backgroundColor: "white",
          color: theme.colors.gray[7],
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "20px",
        })}
      >
        <Checkbox radius="xl" />
        <Text weight={500}>{title}</Text>
        <Text weight={300}>{description}</Text>
        <Text weight={300}>{format(date, "dd/MM/yyyy")}</Text>
      </Group>
    );
  };

  const CalendarToday = () => {
    return (
      <>
        <Text>Today</Text>
        <Box>
          {tasks.map((t, idx) => (
            <TaskPill data={t} />
          ))}
        </Box>
      </>
    );
  };

  const CalendarWeek = () => {
    return (
      <>
        <Text>Monday</Text>
        <Box>
          {tasks.map((t, idx) => (
            <TaskPill data={t} />
          ))}
        </Box>
        <Text>Tuesday</Text>
        <Box>
          {tasks.map((t, idx) => (
            <TaskPill data={t} />
          ))}
        </Box>
      </>
    );
  };

  const CalendarNoDate = () => {
    return (
      <>
        <Text>Not scheduled</Text>
        <Box>
          {tasks.map((t, idx) => (
            <TaskPill data={t} />
          ))}
        </Box>
      </>
    );
  };

  interface VerticalTabProps {
    title: string;
    range?: string;
    view: CalendarView;
  }

  const VerticalTab = ({ title, range, view }: VerticalTabProps) => {
    return (
      <Group
        sx={(themes) => ({
          padding: "20px",
          width: "80px",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "20px",
          borderRight: "1px solid gray",
          whiteSpace: "nowrap",
          overflow: "hidden",
          ":hover": {
            cursor: "pointer",
            backgroundColor: "gray",
          },
        })}
        onClick={() => setView(view)}
      >
        <Group
          style={{
            paddingRight: "250px",
            flexDirection: "row-reverse",
            flexWrap: "nowrap",
            transform: "rotate(-90deg)",
          }}
        >
          <Text>{title}</Text>
          <Text>{range || ""}</Text>
        </Group>
      </Group>
    );
  };

  return (
    <>
      <Group
        direction="row"
        align={"stretch"}
        style={{
          height: "100%",
          gap: 0,
        }}
        noWrap
      >
        <VerticalTab
          title="Today"
          range={format(Date.now(), "dd/MM/yyyy")}
          view="today"
        />
        <Box
          style={{ flex: 1, borderRight: "1px solid gray", padding: "20px" }}
        >
          {view === "today" && <CalendarToday />}
          {view === "week" && <CalendarWeek />}
          {view === "no-date" && <CalendarNoDate />}
        </Box>
        <VerticalTab
          title="Week"
          range={`${format(
            startOfWeek(Date.now(), { weekStartsOn: 1 }),
            "dd/MM/yyyy"
          )} - ${format(
            endOfWeek(Date.now(), { weekStartsOn: 1 }),
            "dd/MM/yyyy"
          )}`}
          view="week"
        />
        <VerticalTab title="Not scheduled" view="no-date" />
      </Group>
    </>
  );
};

export default Calendar;
