import { difficultyComments } from "../containers/TaskAddDrawer";
import { IUser } from "../models/user";

export const isCheckbox = (el: Element) =>
  el.tagName.toLowerCase() === "input" &&
  el.getAttribute("type") === "checkbox";

export const isValidDate = (d: Date) => {
  return d instanceof Date && !isNaN(d.getTime());
};

export const shortenText = (text: string, maxLen: number = 20) =>
  text.length > maxLen ? text.substring(0, maxLen) + "..." : text;

export const getUserAvatarSeed = (user?: IUser) => {
  return user?.settings?.avatarSeed || user?.email || "default";
};

export const getRandomItem = (items: any[]) => {
  return items[(items.length * Math.random()) | 0];
};

export const getRandomDifficultyComment = (difficulty?: string) => {
  switch (difficulty) {
    case "easy":
    case "medium":
    case "hard":
      return getRandomItem(difficultyComments[difficulty]);
    default:
      return "";
  }
};
