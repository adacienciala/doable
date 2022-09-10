import { ActionIcon, Grid, Group, Text } from "@mantine/core";
import { addDays, format, isSameDay, subDays } from "date-fns";
import { useCallback, useMemo } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { CalendarViewProps } from "..";
import { AddButton } from "../../../../components/AddButton";
import { TaskList } from "../../../../containers/TaskList";

export const CalendarWeek = ({
  tasks,
  onTaskDone,
  onTaskClick,
  onAddTask,
  options,
}: CalendarViewProps) => {
  const firstDayOfWeek = useMemo(() => options?.start ?? new Date(), [options]);
  const lastDayOfWeek = useMemo(() => options?.end ?? new Date(), [options]);

  const WeekDates = useCallback(() => {
    const weekDates = [];
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
      weekDates.push(addDays(firstDayOfWeek, dayIdx));
    }
    return weekDates;
  }, [firstDayOfWeek]);

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
          <AddButton onClick={() => onAddTask({ date })} />
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
      <Group style={{ marginBottom: "20px" }}>
        <ActionIcon
          color="gray.0"
          radius="xl"
          variant="outline"
          onClick={() => options?.setFirstDay(subDays(firstDayOfWeek, 7))}
          size="sm"
        >
          <RiArrowLeftSLine size={18} />
        </ActionIcon>
        <Text
          weight={"bold"}
          style={{ display: "inline-block", marginRight: "10px" }}
        >
          Week
        </Text>
        <ActionIcon
          color="gray.0"
          radius="xl"
          variant="outline"
          onClick={() => options?.setFirstDay(addDays(firstDayOfWeek, 7))}
          size="sm"
        >
          <RiArrowRightSLine size={18} />
        </ActionIcon>
        <Text style={{ display: "inline-block" }}>
          {`${format(firstDayOfWeek, "do MMM")} - ${format(
            lastDayOfWeek,
            "do MMM"
          )}`}
        </Text>
      </Group>
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
              height: "50%",
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
