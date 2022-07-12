import { Box, Checkbox, Grid, Group, Text } from "@mantine/core";
import { addDays, endOfWeek, format, isSameDay, startOfWeek } from "date-fns";
import { useCallback, useState } from "react";
const firstDayOfWeek = startOfWeek(Date.now(), { weekStartsOn: 1 });

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");
  const [tasks, setTasks] = useState([
    {
      title: "TitleMonday",
      description: "Some description 1",
      date: addDays(firstDayOfWeek, 0),
    },
    {
      title: "TitleWednesday",
      description: "Some description 2",
      date: addDays(firstDayOfWeek, 2),
    },
    {
      title: "TitleSaturday",
      description: "Some description 3",
      date: addDays(firstDayOfWeek, 5),
    },
  ]);

  type CalendarView = "today" | "week" | "no-date";
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

  const CalendarToday = () => {
    return (
      <>
        <Text weight={"bold"} style={{ display: "inline-block" }}>
          Today
        </Text>
        <Text style={{ display: "inline-block" }}>
          {format(Date.now(), "EEEE, do MMM")}
        </Text>
        <Box>
          {tasks
            .filter((t) => isSameDay(t.date, new Date()))
            .map((t, idx) => (
              <TaskPill data={t} key={idx} />
            ))}
        </Box>
      </>
    );
  };

  const CalendarWeek = () => {
    const WeekDates = useCallback(() => {
      const weekDates = [];
      for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        weekDates.push(addDays(firstDayOfWeek, dayIdx));
      }
      return weekDates;
    }, []);

    const DayOfWeek = (date: Date) => {
      return (
        <>
          <Text
            sx={() => ({
              marginBottom: "20px",
            })}
          >
            {format(date, "EEEE, do MMM")}
          </Text>
          <Box>
            {tasks
              .filter((t) => isSameDay(t.date, date))
              .map((t, idx) => (
                <TaskPill data={t} key={idx} />
              ))}
          </Box>
        </>
      );
    };

    return (
      <>
        <Grid
          justify="space-between"
          columns={4}
          gutter={50}
          style={{ height: "100%" }}
        >
          {WeekDates().map((date, idx) => (
            <Grid.Col
              key={idx}
              span={1}
              sx={() => ({
                order: idx < 3 ? idx : idx + 1,
              })}
            >
              {DayOfWeek(date)}
            </Grid.Col>
          ))}
          <Grid.Col
            span={1}
            sx={() => ({
              order: 3,
            })}
          >
            Lol
          </Grid.Col>
        </Grid>
      </>
    );
  };

  const CalendarNoDate = () => {
    return (
      <>
        <Text>Not scheduled</Text>
        <Box>
          {tasks.map((t, idx) => (
            <TaskPill data={t} key={idx} />
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
        onClick={() => setView(view)}
      >
        <Group
          style={{
            transformOrigin: "left center",
            flexWrap: "nowrap",
            transform: "rotate(90deg)",
          }}
        >
          <Text>{title}</Text>
          {range && <Text>{range}</Text>}
        </Group>
      </Group>
    );
  };

  const CalendarContent = ({ view }: { view: CalendarView }) => {
    return (
      <Box
        style={{
          flexGrow: 1,
          borderRight: "1px solid gray",
          padding: "20px",
        }}
      >
        {view === "today" && <CalendarToday />}
        {view === "week" && <CalendarWeek />}
        {view === "no-date" && <CalendarNoDate />}
      </Box>
    );
  };

  interface CalendarTabProps {
    title: string;
    range?: string;
    tabView: CalendarView;
  }

  const CalendarTab = ({ title, range, tabView }: CalendarTabProps) => {
    return (
      <Group direction="row" style={{ alignItems: "stretch" }}>
        <VerticalTab title={title} range={range} view={tabView} />
        {view === tabView && <CalendarContent view={tabView} />}
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
        <CalendarTab
          title="Today"
          range={format(Date.now(), "dd/MM/yyyy")}
          tabView="today"
        />
        <CalendarTab
          title="Week"
          range={`${format(
            startOfWeek(Date.now(), { weekStartsOn: 1 }),
            "dd/MM/yyyy"
          )} - ${format(
            endOfWeek(Date.now(), { weekStartsOn: 1 }),
            "dd/MM/yyyy"
          )}`}
          tabView="week"
        />
        <CalendarTab title="Not scheduled" tabView="no-date" />
      </Group>
    </>
  );
};

export default Calendar;
