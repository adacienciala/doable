import { TaskData } from "../../../components/TaskPill";

export interface CalendarViewProps {
  tasks: TaskData[];
  onTaskDone: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
  onAddTask: (data?: { date?: Date; projectId?: string }) => void;
  options?: Record<string, any>;
}

export type CalendarView = "today" | "week" | "no-date";

export { CalendarNoDate } from "./CalendarNoDate";
export { CalendarToday } from "./CalendarToday";
export { CalendarWeek } from "./CalendarWeek";
