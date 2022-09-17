import { TaskExtended } from "../../../api/client";

export interface CalendarViewProps {
  tasks: TaskExtended[];
  handleTaskDone: (taskId: string) => void;
  handleTaskOnFinish?: () => void;
  onTaskClick: (taskId: string) => void;
  onAddTask: (data?: { date?: Date; projectId?: string }) => void;
  options?: Record<string, any>;
}

export type CalendarView = "today" | "week" | "no-date" | "backlog";

export { CalendarNoDate } from "./CalendarNoDate";
export { CalendarToday } from "./CalendarToday";
export { CalendarWeek } from "./CalendarWeek";
