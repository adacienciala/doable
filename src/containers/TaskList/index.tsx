import { ScrollArea, Stack } from "@mantine/core";
import { Reorder } from "framer-motion";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { TaskExtended } from "../../api/client";
import { TaskPill } from "../../components/TaskPill";
import { CalendarView } from "../../pages/Calendar/CalendarView";
import { isCheckbox } from "../../utils/utils";

export const TaskList = ({
  tasks = [],
  view,
  handleTaskDone,
  handleTaskOnFinish,
  onTaskClick,
}: {
  tasks: TaskExtended[];
  view: CalendarView;
  handleTaskDone: (taskId: string) => void;
  handleTaskOnFinish?: () => void;
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

  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  return (
    <Stack style={{ height: "100%" }}>
      <ScrollArea style={{ height: "100%" }}>
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          layoutScroll
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {items.map((item) => (
            <Reorder.Item
              key={item.taskId}
              value={item}
              onClick={(e) => handleTaskClick(e, item.taskId)}
              onDragStart={(e) => setIsDragged(true)}
            >
              <TaskPill
                data={item}
                view={view}
                handleTaskOnFinish={handleTaskOnFinish}
                handleTaskDone={handleTaskDone}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </ScrollArea>
    </Stack>
  );
};
