import { Placement, Step } from "react-joyride";

export const tutorialSteps: { [key: string]: Step[] } = {
  dashboard: [
    {
      title: "Dashboard tour",
      target: "body",
      content: <div>That's a dashboard bruh</div>,
      placement: "center" as Placement,
      disableBeacon: true,
    },
    {
      title: "!",
      target: '[data-tut="profile"]',
      content: "This is my awesome feature!",
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "!",
      target: '[data-tut="nav-links"]',
      content: "This another awesome  secondfeature!",
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
  ],
  calendar: [
    {
      title: "calendar tour",
      target: "body",
      content: <div>That's a calendar bruh</div>,
      placement: "center" as Placement,
      disableBeacon: true,
    },
    {
      title: "!",
      target: '[data-tut="profile"]',
      content: "This is my awesome feature!",
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
    {
      title: "!",
      target: '[data-tut="nav-links"]',
      content: "This another awesome  secondfeature!",
      placement: "bottom" as Placement,
      disableBeacon: false,
    },
  ],
};
