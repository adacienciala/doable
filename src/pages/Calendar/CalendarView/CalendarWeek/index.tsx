import { Box, Grid, Group, Text } from "@mantine/core";
import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { endOfWeek } from "date-fns/esm";
import { useCallback } from "react";
import { CalendarViewProps } from "..";
import { AddButton } from "../../../../components/AddButton";
import { TaskList } from "../../../../containers/TaskList";

const firstDayOfWeek = startOfWeek(Date.now(), { weekStartsOn: 1 });

export const CalendarWeek = ({
  tasks,
  onTaskDone,
  onTaskClick,
  onAddTask,
}: CalendarViewProps) => {
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
        <Group
          sx={(theme) => ({
            justifyContent: "space-between",
            marginBottom: "20px",
            flexWrap: "nowrap",
          })}
        >
          <Text>{format(date, "EEEE, do MMM")}</Text>
          <AddButton onClick={() => onAddTask(date)} />
        </Group>

        <TaskList
          tasks={tasks.filter((t) =>
            t.date ? isSameDay(t.date, date) : false
          )}
          view="week"
          onTaskDone={onTaskDone}
          onTaskClick={onTaskClick}
        />
      </>
    );
  };

  const HabitTracker = () => {
    return (
      <>
        <Group
          sx={(theme) => ({
            backgroundColor: theme.colors.yellow[6],
            borderRadius: "10px",
            padding: "20px",
            color: "black",
            height: "100%",
            justifyContent: "center",
            fontStyle: "italic",
          })}
        >
          Work In Progress
        </Group>
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
          <HabitTracker />
        </Grid.Col>
      </Grid>
    </>
  );
};
