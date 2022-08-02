import { Box, Grid, Text } from "@mantine/core";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { endOfWeek } from "date-fns/esm";
import { useCallback } from "react";
import { TaskData } from "../../../components/TaskPill";
import { TaskList } from "../../../containers/TaskList";

const firstDayOfWeek = startOfWeek(Date.now(), { weekStartsOn: 1 });

export const CalendarWeek = ({ tasks }: { tasks: TaskData[] }) => {
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
        <Text style={{ marginBottom: "20px" }}>
          {format(date, "EEEE, do MMM")}
        </Text>
        <TaskList
          tasks={tasks.filter((t) => isSameDay(t.date, date))}
          view="week"
        />
      </>
    );
  };

  return (
    <>
      <Box style={{ marginBottom: "20px" }}>
        <Text
          weight={"bold"}
          style={{ display: "inline-block", marginRight: "10px" }}
        >
          Week
        </Text>
        <Text style={{ display: "inline-block" }}>
          {`${format(firstDayOfWeek, "do MMM")} - ${format(
            endOfWeek(new Date()),
            "do MMM"
          )} `}
        </Text>
      </Box>
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
