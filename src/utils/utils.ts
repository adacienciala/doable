export const isCheckbox = (el: Element) =>
  el.tagName.toLowerCase() === "input" &&
  el.getAttribute("type") === "checkbox";

export const isValidDate = (d: Date) => {
  return d instanceof Date && !isNaN(d.getTime());
};
