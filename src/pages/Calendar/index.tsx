import { Group, Text } from "@mantine/core";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CalendarNoDate } from "./CalendarNoDate";
import { CalendarToday } from "./CalendarToday";
import { CalendarWeek } from "./CalendarWeek";
const firstDayOfWeek = startOfWeek(Date.now(), { weekStartsOn: 1 });

export type CalendarView = "today" | "week" | "no-date";

const Calendar = () => {
  const [view, setView] = useState<CalendarView>("today");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "TitleMonday",
      description: "Some description 1",
      date: addDays(firstDayOfWeek, 0),
    },
    {
      id: 2,
      title: "TitleWednesday",
      description: "Some description 2",
      date: addDays(firstDayOfWeek, 2),
    },
    {
      id: 3,
      title: "TitleSaturday",
      description: "Some description 3",
      date: addDays(firstDayOfWeek, 5),
    },
    {
      id: 4,
      title: "TitleToday",
      description: "Some description 1",
      date: new Date(),
    },
    {
      id: 5,
      title: "TitleToday",
      description: "Some description 1",
      date: new Date(),
    },
  ]);

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
