export interface ITask {
  taskId: string;
  title: string;
  description: string;
  date: Date;
  xp: number;
  owner: string[];
  projectId: string;
  isChallenge: boolean;
  isDone: boolean;
  repeat: string;
}
