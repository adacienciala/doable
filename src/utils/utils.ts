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
