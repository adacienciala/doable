import { Group, LoadingOverlay, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { APIClient, Method } from "../../api/task";
import { TaskData } from "../../components/TaskPill";
import { CalendarNoDate } from "./CalendarNoDate";
import { CalendarToday } from "./CalendarToday";
import { CalendarWeek } from "./CalendarWeek";

export type CalendarView = "today" | "week" | "no-date";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");

  const {
    isLoading,
    isSuccess,
    error,
    data: tasks,
  } = useQuery(["tasks"], () => {
    const client = new APIClient();
    return client.tasks(Method.GET);
  });

  if (isSuccess) {
    tasks.forEach((task: TaskData) => (task.date = new Date(task.date))); // <-- data is guaranteed to be defined
  }

  interface VerticalTabProps {
    title: string;
    range?: string;
    view: CalendarView;
  }

  const VerticalTab = ({ title, range, view }: VerticalTabProps) => {
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
        onClick={() => setView(view)}
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

  interface CalendarTabProps {
    title: string;
    range?: string;
    tabView: CalendarView;
  }

  const CalendarTab = ({ title, range, tabView }: CalendarTabProps) => {
    const open = view === tabView;

    const MotionGroup = motion(Group);

    return (
      <MotionGroup
        direction="row"
        style={{
          alignItems: "stretch",
          flexGrow: open ? 1 : 0,
          flexWrap: "nowrap",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          ease: "easeOut",
          duration: 1,
        }}
      >
        <VerticalTab title={title} range={range} view={tabView} />
        <AnimatePresence>
          {open && (
            <div
              style={{
                width: "100%",
                borderRight: "1px solid gray",
                padding: "20px",
              }}
            >
              {view === "today" && <CalendarToday tasks={tasks} />}
              {view === "week" && <CalendarWeek tasks={tasks} />}
              {view === "no-date" && <CalendarNoDate tasks={tasks} />}
            </div>
          )}
        </AnimatePresence>
      </MotionGroup>
    );
  };

  return (
    <>
      <LoadingOverlay
        visible={isLoading}
        overlayOpacity={0.8}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />
      {error && "An error has occurred"}
      {tasks && (
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
      )}
    </>
  );
};

export default Calendar;
