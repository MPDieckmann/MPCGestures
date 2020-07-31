import { Gestures, GesturesEvent } from "./ts/index";
import MPC from "@mpc/mpc";

export * from "./ts/index";

type GesturesConstructor = typeof Gestures;
type GesturesEventConstructor = typeof GesturesEvent;

declare module "@mpc/mpc" {
  interface MPC {
    Gestures: GesturesConstructor;
    GesturesEvent: GesturesEventConstructor;
  }
}

MPC.Gestures = Gestures;
MPC.GesturesEvent = GesturesEvent;
