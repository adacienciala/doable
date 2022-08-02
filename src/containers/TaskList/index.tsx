import { Reorder } from "framer-motion";
import { useState } from "react";
import { TaskData, TaskPill } from "../../components/TaskPill";
import { CalendarView } from "../../pages/Calendar";

export const TaskList = ({
  tasks,
  view,
}: {
  tasks: TaskData[];
  view: CalendarView;
}) => {
  const [items, setItems] = useState(tasks);
  return (
    <>
      <Reorder.Group axis="y" values={items} onReorder={setItems}>
        {items.map((item) => (
          <Reorder.Item key={item.id} value={item}>
            <TaskPill data={item} view={view} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </>
  );
};
