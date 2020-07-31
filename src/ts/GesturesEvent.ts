export class GesturesEvent extends UIEvent {
  constructor(type: "mpc-down" | "mpc-move" | "mpc-swipe" | "mpc-zoom" | "mpc-up", eventInitDict?: GesturesEventInit);
  constructor(type: string, eventInitDict?: GesturesEventInit);
  constructor(type: string, eventInitDict?: GesturesEventInit) {
    super(type, eventInitDict);
    this.#movementX = eventInitDict.movementX || 0;
    this.#movementY = eventInitDict.movementY || 0;
    this.#clientX = eventInitDict.clientX || 0;
    this.#clientY = eventInitDict.clientY || 0;
    this.#pageX = eventInitDict.pageX || 0;
    this.#pageY = eventInitDict.pageY || 0;
    this.#screenX = eventInitDict.screenX || 0;
    this.#screenY = eventInitDict.screenY || 0;
    this.#info = eventInitDict.info || null;
  }
  #movementX: number;
  get movementX() { return this.#movementX; }
  #movementY: number;
  get movementY() { return this.#movementY; }
  #clientX: number;
  get clientX() { return this.#clientX; }
  #clientY: number;
  get clientY() { return this.#clientY; }

  get offsetX() { return (<HTMLElement>this.target).getBoundingClientRect().x - this.#clientX; }
  get offsetY() { return (<HTMLElement>this.target).getBoundingClientRect().y - this.#clientY; }

  #pageX: number;
  get pageX() { return this.#pageX; }
  #pageY: number;
  get pageY() { return this.#pageY; }
  #screenX: number;
  get screenX() { return this.#screenX; }
  #screenY: number;
  get screenY() { return this.#screenY; }

  #info: {
    type: "touch";
    movements: TouchMovement[];
  } | {
    type: "mouse" | "pointer";
    movement: MouseMovement;
  } | {
    type: "wheel";
    ctrl: boolean;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
  };
  get info() { return this.#info; }
}
Object.defineProperty(GesturesEvent.prototype, Symbol.toStringTag, {
  value: "MPCGesturesEvent",
});
export default GesturesEvent;

export interface GesturesEventInit extends UIEventInit {
  movementX?: number;
  movementY?: number;
  clientX?: number;
  clientY?: number;
  pageX?: number;
  pageY?: number;
  screenX?: number;
  screenY?: number;
  info?: {
    type: "touch";
    movements: TouchMovement[];
  } | {
    type: "mouse" | "pointer";
    movement: MouseMovement;
  } | {
    type: "wheel";
    ctrl: boolean;
    deltaX: number;
    deltaY: number;
    deltaZ: number;
  };
}

export interface Move {
  screenX: number;
  screenY: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  target: EventTarget;
  timeStamp: number;
}
export interface TouchMove extends Move {
  identifier: number;
}
export interface MouseMove extends Move {
  ctrl: boolean;
  buttons: number;
}
// export interface PointerMove extends MouseMove {
//   pointerType: string;
//   identifer: number;
// }
export interface Movement {
  from: Move;
  to: Move;
}
export interface TouchMovement extends Movement {
  identifier: number;
}
export interface MouseMovement extends Movement {
  ctrl: boolean;
  buttons: number;
}
