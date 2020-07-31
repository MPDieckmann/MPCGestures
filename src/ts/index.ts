export * from "./Gestures";
export * from "./GesturesEvent";
import GesturesEvent from "./GesturesEvent";

declare global {
  interface GlobalEventHandlersEventMap {
    "mpc-down": GesturesEvent;
    "mpc-move": GesturesEvent;
    "mpc-swipe": GesturesEvent;
    "mpc-zoom": GesturesEvent;
    "mpc-up": GesturesEvent;
  }
}