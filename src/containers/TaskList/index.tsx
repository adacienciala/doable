import { Reorder } from "framer-motion";
import { MouseEvent, useCallback, useState } from "react";
import { TaskData, TaskPill } from "../../components/TaskPill";
import { CalendarView } from "../../pages/Calendar/CalendarView";
import { isCheckbox } from "../../utils/utils";

export const TaskList = ({
  tasks,
  view,
  onTaskDone,
  onTaskClick,
}: {
  tasks: TaskData[];
  view: CalendarView;
  onTaskDone: (taskId: string) => void;
  onTaskClick: (taskId: string) => void;
}) => {
  const [items, setItems] = useState(tasks);
  const [isDragged, setIsDragged] = useState(false);

  const handleTaskClick = useCallback(
    async (event: MouseEvent<HTMLDivElement>, taskId: string) => {
      if (isDragged) {
        setIsDragged(false);
        return;
      }

      if (event.target instanceof Element && !isCheckbox(event.target)) {
        onTaskClick(taskId);
      }
    },
    [onTaskClick, isDragged]
  );

  return (
    <>
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          maxHeight: "70%",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {items.map((item) => (
          <Reorder.Item
            key={item.taskId}
            value={item}
            onClick={(e) => handleTaskClick(e, item.taskId)}
            onDragStart={(e) => setIsDragged(true)}
          >
            <TaskPill data={item} view={view} onTaskDone={onTaskDone} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </>
  );
};
