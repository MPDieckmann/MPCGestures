import GesturesEvent, { GesturesEventInit, TouchMove, MouseMove } from "./GesturesEvent";

type INPUT_MODE = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
// type INPUT_MODE = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
type INPUT_MOUSE = 1;
type INPUT_TOUCH = 2;
type INPUT_WHEEL = 4;
// type INPUT_POINTER = 8;

export class Gestures {
  constructor() {
    this.activate();
  }

  static readonly INPUT_MOUSE: INPUT_MODE = 1;
  static readonly INPUT_TOUCH: INPUT_MODE = 2;
  static readonly INPUT_WHEEL: INPUT_MODE = 4;
  // static readonly INPUT_POINTER: INPUT_MODE = 8;

  readonly INPUT_MOUSE: INPUT_MODE = 1;
  readonly INPUT_TOUCH: INPUT_MODE = 2;
  readonly INPUT_WHEEL: INPUT_MODE = 4;
  // readonly INPUT_POINTER: INPUT_MODE = 8;

  #touches: TouchMove[] = [];
  get touches() { return this.#touches; }
  #touchesLength: number = 0;
  get touchesLength() { return this.#touchesLength; }
  #mouse: MouseMove = null;
  get mouse() { return this.#mouse; }
  // #pointer: PointerMove = null;
  // get pointer() { return this.#pointer; }
  #minMovementForSwipes: number = 50;
  get minMovementForSwipes() { return this.#minMovementForSwipes; }
  set minMovementForSwipes(value: number) { this.#minMovementForSwipes = value > 50 ? value > this.#maxMovementForSwipes ? this.#maxMovementForSwipes - 1 : value : 50; }
  #maxMovementForSwipes: number = 150;
  get maxMovementForSwipes() { return this.#maxMovementForSwipes; }
  set maxMovementForSwipes(value: number) { this.#maxMovementForSwipes = value > this.#minMovementForSwipes ? value : this.#minMovementForSwipes + 1; }
  #maxDurationForSwipes: number = 1000;
  get maxDurationForSwipes() { return this.#maxDurationForSwipes; }
  set maxDurationForSwipes(value: number) { this.#maxDurationForSwipes = value > 50 ? value : 50; }

  #down = (event: Event) => {
    if (event instanceof TouchEvent) {
      var touch0: Touch = event.touches[event.touches.length - 1];
      this.#touches.push({
        pageX: touch0.pageX,
        pageY: touch0.pageY,
        screenX: touch0.screenX,
        screenY: touch0.screenY,
        clientX: touch0.clientX,
        clientY: touch0.clientY,
        target: touch0.target,
        identifier: touch0.identifier,
        timeStamp: event.timeStamp,
      });
      if (this.#touches.length > this.#touchesLength) {
        this.#touchesLength = this.#touches.length;
      }
      if (!this.trigger(event.target, "mpc-down", {
        bubbles: true,
        cancelable: true,
        view: event.view,
        movementX: 0,
        movementY: 0,
        clientX: touch0.clientX,
        clientY: touch0.clientY,
        pageX: touch0.pageX,
        pageY: touch0.pageY,
        screenX: touch0.screenX,
        screenY: touch0.screenY,
        info: {
          type: "touch",
          movements: [{
            identifier: touch0.identifier,
            from: {
              clientX: touch0.clientX,
              clientY: touch0.clientY,
              pageX: touch0.pageX,
              pageY: touch0.pageY,
              screenX: touch0.screenX,
              screenY: touch0.screenY,
              target: touch0.target,
              timeStamp: event.timeStamp,
            },
            to: {
              clientX: touch0.clientX,
              clientY: touch0.clientY,
              pageX: touch0.pageX,
              pageY: touch0.pageY,
              screenX: touch0.screenX,
              screenY: touch0.screenY,
              target: touch0.target,
              timeStamp: event.timeStamp,
            },
          }],
        },
      })) {
        event.preventDefault();
      }
      // } else if (event instanceof PointerEvent) {
      //   console.log("down", event);
    } else if (event instanceof MouseEvent) {
      this.#mouse = {
        pageX: event.pageX,
        pageY: event.pageY,
        screenX: event.screenX,
        screenY: event.screenY,
        clientX: event.clientX,
        clientY: event.clientY,
        ctrl: event.ctrlKey,
        buttons: event.buttons,
        target: event.target,
        timeStamp: event.timeStamp,
      };
      if (!this.trigger(event.target, "mpc-down", {
        bubbles: true,
        cancelable: true,
        view: event.view,
        movementX: 0,
        movementY: 0,
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        screenX: event.screenX,
        screenY: event.screenY,
        info: {
          type: "mouse",
          movement: {
            ctrl: this.#mouse.ctrl,
            buttons: this.#mouse.buttons,
            from: {
              clientX: this.#mouse.clientX,
              clientY: this.#mouse.clientY,
              pageX: this.#mouse.pageX,
              pageY: this.#mouse.pageY,
              screenX: this.#mouse.screenX,
              screenY: this.#mouse.screenY,
              target: this.#mouse.target,
              timeStamp: this.#mouse.timeStamp,
            },
            to: {
              clientX: this.#mouse.clientX,
              clientY: this.#mouse.clientY,
              pageX: this.#mouse.pageX,
              pageY: this.#mouse.pageY,
              screenX: this.#mouse.screenX,
              screenY: this.#mouse.screenY,
              target: this.#mouse.target,
              timeStamp: this.#mouse.timeStamp,
            },
          },
        },
      })) {
        event.preventDefault();
      }
    }
  }
  #move = (event: Event) => {
    if (event instanceof TouchEvent) {
      if (this.#touches.length == 1) {
        let touch0_start = this.#touches[0];
        let touch0_end = event.touches[0];
        let movementX = touch0_end.screenX - touch0_start.screenX;
        let movementY = touch0_end.screenY - touch0_start.screenY;
        if (movementX != 0 || movementY != 0) {
          if (!this.trigger(event.target, "mpc-move", {
            bubbles: true,
            cancelable: true,
            view: event.view,
            movementX: movementX,
            movementY: movementY,
            clientX: touch0_end.clientX,
            clientY: touch0_end.clientY,
            pageX: touch0_end.pageX,
            pageY: touch0_end.pageY,
            screenX: touch0_end.screenX,
            screenY: touch0_end.screenY,
            info: {
              type: "touch",
              movements: [{
                identifier: touch0_start.identifier,
                from: {
                  clientX: touch0_start.clientX,
                  clientY: touch0_start.clientY,
                  pageX: touch0_start.pageX,
                  pageY: touch0_start.pageY,
                  screenX: touch0_start.screenX,
                  screenY: touch0_start.screenY,
                  target: touch0_start.target,
                  timeStamp: touch0_start.timeStamp,
                },
                to: {
                  clientX: touch0_end.clientX,
                  clientY: touch0_end.clientY,
                  pageX: touch0_end.pageX,
                  pageY: touch0_end.pageY,
                  screenX: touch0_end.screenX,
                  screenY: touch0_end.screenY,
                  target: touch0_end.target,
                  timeStamp: event.timeStamp,
                },
              }],
            },
          })) {
            event.preventDefault();
          }
        }
      } else if (this.#touches.length == 2) {
        let touch0_start = this.#touches[0];
        let touch1_start = this.#touches[1];
        let touch0_end = event.touches[0];
        let touch1_end = event.touches[1];
        let screenX = (touch0_end.screenX + touch1_end.screenX) / 2;
        let screenY = (touch0_end.screenY + touch1_end.screenY) / 2;
        let movementX = screenX - (touch0_start.screenX + touch1_start.screenX) / 2;
        let movementY = screenY - (touch0_start.screenY + touch1_start.screenY) / 2;
        if (movementX != 0 || movementY != 0) {
          if (!this.trigger(event.target, "mpc-zoom", {
            bubbles: true,
            cancelable: true,
            view: event.view,
            movementX: movementX,
            movementY: movementY,
            clientX: (touch0_end.clientX + touch1_end.clientX) / 2,
            clientY: (touch0_end.clientY + touch1_end.clientY) / 2,
            pageX: (touch0_end.pageX + touch1_end.pageX) / 2,
            pageY: (touch0_end.pageY + touch1_end.pageY) / 2,
            screenX: screenX,
            screenY: screenY,
            info: {
              type: "touch",
              movements: [{
                identifier: touch0_start.identifier,
                from: {
                  clientX: touch0_start.clientX,
                  clientY: touch0_start.clientY,
                  pageX: touch0_start.pageX,
                  pageY: touch0_start.pageY,
                  screenX: touch0_start.screenX,
                  screenY: touch0_start.screenY,
                  target: touch0_start.target,
                  timeStamp: touch0_start.timeStamp,
                },
                to: {
                  clientX: touch0_end.clientX,
                  clientY: touch0_end.clientY,
                  pageX: touch0_end.pageX,
                  pageY: touch0_end.pageY,
                  screenX: touch0_end.screenX,
                  screenY: touch0_end.screenY,
                  target: touch0_end.target,
                  timeStamp: event.timeStamp,
                },
              }, {
                identifier: touch1_start.identifier,
                from: {
                  clientX: touch1_start.clientX,
                  clientY: touch1_start.clientY,
                  pageX: touch1_start.pageX,
                  pageY: touch1_start.pageY,
                  screenX: touch1_start.screenX,
                  screenY: touch1_start.screenY,
                  target: touch1_start.target,
                  timeStamp: touch1_start.timeStamp,
                },
                to: {
                  clientX: touch1_end.clientX,
                  clientY: touch1_end.clientY,
                  pageX: touch1_end.pageX,
                  pageY: touch1_end.pageY,
                  screenX: touch1_end.screenX,
                  screenY: touch1_end.screenY,
                  target: touch1_end.target,
                  timeStamp: event.timeStamp,
                },
              }],
            },
          })
          ) {
            event.preventDefault();
          }
        }
      }
      // } else if (event instanceof PointerEvent) {
      //   console.log("move", event);
    } else if (event instanceof MouseEvent) {
      if (this.#mouse) {
        let movementX = event.screenX - this.#mouse.screenX;
        let movementY = event.screenY - this.#mouse.screenY;
        if (movementX != 0 || movementY != 0) {
          if (!this.trigger(event.target, this.#mouse.ctrl ? "mpc-zoom" : "mpc-move", {
            bubbles: true,
            cancelable: true,
            view: event.view,
            movementX: movementX,
            movementY: movementY,
            clientX: event.clientX,
            clientY: event.clientY,
            pageX: event.pageX,
            pageY: event.pageY,
            screenX: event.screenX,
            screenY: event.screenY,
            info: {
              type: "mouse",
              movement: {
                ctrl: this.#mouse.ctrl,
                buttons: this.#mouse.buttons,
                from: {
                  clientX: this.#mouse.clientX,
                  clientY: this.#mouse.clientY,
                  pageX: this.#mouse.pageX,
                  pageY: this.#mouse.pageY,
                  screenX: this.#mouse.screenX,
                  screenY: this.#mouse.screenY,
                  target: this.#mouse.target,
                  timeStamp: this.#mouse.timeStamp,
                },
                to: {
                  clientX: event.clientX,
                  clientY: event.clientY,
                  pageX: event.pageX,
                  pageY: event.pageY,
                  screenX: event.screenX,
                  screenY: event.screenY,
                  target: event.target,
                  timeStamp: event.timeStamp,
                },
              },
            },
          })) {
            event.preventDefault();
          }
        }
      }
    }
  }
  #up = (event: Event) => {
    if (event instanceof TouchEvent) {
      if (
        this.#touchesLength == 1 &&
        event.timeStamp - this.#touches[0].timeStamp <= this.#maxDurationForSwipes
      ) {
        let touch0_start = this.#touches[0];
        let touch0_end = event.changedTouches[0];
        let movementX = touch0_end.screenX - touch0_start.screenX;
        let movementY = touch0_end.screenY - touch0_start.screenY;
        let abs_movement = movementX * movementX + movementY * movementY;
        if (
          abs_movement >= this.#minMovementForSwipes * this.#minMovementForSwipes &&
          abs_movement <= this.#maxMovementForSwipes * this.#maxMovementForSwipes
        ) {
          if (!this.trigger(touch0_start.target, "mpc-swipe", {
            bubbles: true,
            cancelable: true,
            view: event.view,
            movementX: movementX,
            movementY: movementY,
            clientX: touch0_start.clientX,
            clientY: touch0_start.clientY,
            pageX: touch0_start.pageX,
            pageY: touch0_start.pageY,
            screenX: touch0_start.screenX,
            screenY: touch0_start.screenY,
            info: {
              type: "touch",
              movements: [
                {
                  identifier: touch0_start.identifier,
                  from: {
                    clientX: touch0_start.clientX,
                    clientY: touch0_start.clientY,
                    pageX: touch0_start.pageX,
                    pageY: touch0_start.pageY,
                    screenX: touch0_start.screenX,
                    screenY: touch0_start.screenY,
                    target: touch0_start.target,
                    timeStamp: touch0_start.timeStamp
                  },
                  to: {
                    clientX: touch0_end.clientX,
                    clientY: touch0_end.clientY,
                    pageX: touch0_end.pageX,
                    pageY: touch0_end.pageY,
                    screenX: touch0_end.screenX,
                    screenY: touch0_end.screenY,
                    target: touch0_end.target,
                    timeStamp: touch0_start.timeStamp
                  }
                }
              ]
            }
          })) {
            event.preventDefault();
          }
        }
        if (!this.trigger(event.target, "mpc-up", {
          bubbles: true,
          cancelable: true,
          view: event.view,
          movementX: movementX,
          movementY: movementY,
          clientX: touch0_end.clientX,
          clientY: touch0_end.clientY,
          pageX: touch0_end.pageX,
          pageY: touch0_end.pageY,
          screenX: touch0_end.screenX,
          screenY: touch0_end.screenY,
          info: {
            type: "touch",
            movements: [
              {
                identifier: touch0_start.identifier,
                from: {
                  clientX: touch0_start.clientX,
                  clientY: touch0_start.clientY,
                  pageX: touch0_start.pageX,
                  pageY: touch0_start.pageY,
                  screenX: touch0_start.screenX,
                  screenY: touch0_start.screenY,
                  target: touch0_start.target,
                  timeStamp: touch0_start.timeStamp,
                },
                to: {
                  clientX: touch0_end.clientX,
                  clientY: touch0_end.clientY,
                  pageX: touch0_end.pageX,
                  pageY: touch0_end.pageY,
                  screenX: touch0_end.screenX,
                  screenY: touch0_end.screenY,
                  target: touch0_end.target,
                  timeStamp: event.timeStamp,
                }
              }
            ]
          }
        })) {
          event.preventDefault();
        }
      }
      this.#touches = this.#touches.filter((touch) => getTouchByIdentifer(touch.identifier, event.touches) > -1);
      if (this.#touches.length == 0) {
        this.#touchesLength = 0;
      }
      // } else if (event instanceof PointerEvent) {
      //   console.log("up", event);
    } else if (event instanceof MouseEvent) {
      if (this.#mouse && event.timeStamp - this.#mouse.timeStamp <= this.#maxDurationForSwipes) {
        let movementX = event.screenX - this.#mouse.screenX;
        let movementY = event.screenY - this.#mouse.screenY;
        let abs_movement = movementX * movementX + movementY * movementY;
        if (
          abs_movement >= this.#minMovementForSwipes * this.#minMovementForSwipes &&
          abs_movement <= this.#maxMovementForSwipes * this.#maxMovementForSwipes
        ) {
          if (!this.trigger(this.#mouse.target, "mpc-swipe", {
            bubbles: true,
            cancelable: true,
            view: event.view,
            movementX: movementX,
            movementY: movementY,
            clientX: this.#mouse.clientX,
            clientY: this.#mouse.clientY,
            pageX: this.#mouse.pageX,
            pageY: this.#mouse.pageY,
            screenX: this.#mouse.screenX,
            screenY: this.#mouse.screenY,
            info: {
              type: "mouse",
              movement: {
                ctrl: this.#mouse.ctrl,
                buttons: this.#mouse.buttons,
                from: {
                  clientX: this.#mouse.clientX,
                  clientY: this.#mouse.clientY,
                  pageX: this.#mouse.pageX,
                  pageY: this.#mouse.pageY,
                  screenX: this.#mouse.screenX,
                  screenY: this.#mouse.screenY,
                  target: this.#mouse.target,
                  timeStamp: this.#mouse.timeStamp,
                },
                to: {
                  clientX: event.clientX,
                  clientY: event.clientY,
                  pageX: event.pageX,
                  pageY: event.pageY,
                  screenX: event.screenX,
                  screenY: event.screenY,
                  target: event.target,
                  timeStamp: event.timeStamp,
                },
              },
            },
          })) {
            event.preventDefault();
          }
        }
        if (!this.trigger(event.target, "mpc-up", {
          bubbles: true,
          cancelable: true,
          view: event.view,
          movementX: movementX,
          movementY: movementY,
          clientX: event.clientX,
          clientY: event.clientY,
          pageX: event.pageX,
          pageY: event.pageY,
          screenX: event.screenX,
          screenY: event.screenY,
          info: {
            type: "mouse",
            movement: {
              ctrl: this.#mouse.ctrl,
              buttons: this.#mouse.buttons,
              from: {
                clientX: this.#mouse.clientX,
                clientY: this.#mouse.clientY,
                pageX: this.#mouse.pageX,
                pageY: this.#mouse.pageY,
                screenX: this.#mouse.screenX,
                screenY: this.#mouse.screenY,
                target: this.#mouse.target,
                timeStamp: this.#mouse.timeStamp,
              },
              to: {
                clientX: event.clientX,
                clientY: event.clientY,
                pageX: event.pageX,
                pageY: event.pageY,
                screenX: event.screenX,
                screenY: event.screenY,
                target: event.target,
                timeStamp: event.timeStamp,
              },
            },
          },
        })) {
          event.preventDefault();
        }
      }
      this.#mouse = null;
    }
  }
  #wheel = (event: Event) => {
    if (event instanceof WheelEvent) {
      this.trigger(event.target, event.ctrlKey ? "mpc-zoom" : "mpc-move", {
        bubbles: true,
        cancelable: false,
        view: event.view,
        movementX: event.deltaX,
        movementY: event.deltaY,
        clientX: event.clientX,
        clientY: event.clientY,
        pageX: event.pageX,
        pageY: event.pageY,
        screenX: event.screenX,
        screenY: event.screenY,
        info: {
          type: "wheel",
          ctrl: event.ctrlKey,
          deltaX: event.deltaX,
          deltaY: event.deltaY,
          deltaZ: event.deltaZ,
        },
      });
    }
  }

  #mode: INPUT_MODE = 0;
  get mode() { return this.#mode; }

  activate(mode: INPUT_MODE = 7) {
    this.#mode |= mode;
    if ((mode & this.INPUT_MOUSE) == this.INPUT_MOUSE) {
      globalThis.addEventListener("mousedown", this.#down, true);
      globalThis.addEventListener("mousemove", this.#move, true);
      globalThis.addEventListener("mouseup", this.#up, true);
    }
    if ((mode & this.INPUT_TOUCH) == this.INPUT_TOUCH) {
      globalThis.addEventListener("touchstart", this.#down, true);
      globalThis.addEventListener("touchmove", this.#move, true);
      globalThis.addEventListener("touchcancel", this.#up, true);
      globalThis.addEventListener("touchend", this.#up, true);
    }
    if ((mode & this.INPUT_WHEEL) == this.INPUT_WHEEL) {
      globalThis.addEventListener("wheel", this.#wheel, true);
      globalThis.addEventListener("mousewheel", this.#wheel, true);
    }
    // if ((mode & this.INPUT_POINTER) == this.INPUT_POINTER) {
    //   globalThis.addEventListener("pointerdown", this.#down, true);
    //   globalThis.addEventListener("pointermove", this.#move, true);
    //   globalThis.addEventListener("pointercancel", this.#up, true);
    //   globalThis.addEventListener("pointerup", this.#up, true);
    // }
    return this.#mode;
  }
  /**
   * Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.
   */
  trigger(target: EventTarget, type: "mpc-down" | "mpc-move" | "mpc-swipe" | "mpc-zoom" | "mpc-up", eventInitDict: GesturesEventInit): boolean;
  trigger(target: EventTarget, type: string, eventInitDict: GesturesEventInit): boolean;
  trigger(target: EventTarget, type: string, eventInitDict: GesturesEventInit): boolean {
    var event = new GesturesEvent(type, eventInitDict);
    return target.dispatchEvent(event);
  }
  deactivate(mode: INPUT_MODE = 7) {
    this.#mode -= (this.#mode & mode);
    if ((mode & this.INPUT_MOUSE) == this.INPUT_MOUSE) {
      globalThis.removeEventListener("mousedown", this.#down, true);
      globalThis.removeEventListener("mousemove", this.#move, true);
      globalThis.removeEventListener("mouseup", this.#up, true);
    }
    if ((mode & this.INPUT_TOUCH) == this.INPUT_TOUCH) {
      globalThis.removeEventListener("touchstart", this.#down, true);
      globalThis.removeEventListener("touchmove", this.#move, true);
      globalThis.removeEventListener("touchcancel", this.#up, true);
      globalThis.removeEventListener("touchend", this.#up, true);
    }
    if ((mode & this.INPUT_WHEEL) == this.INPUT_WHEEL) {
      globalThis.removeEventListener("wheel", this.#wheel, true);
      globalThis.removeEventListener("mousewheel", this.#wheel, true);
    }
    // if ((mode & this.INPUT_POINTER) == this.INPUT_POINTER) {
    //   globalThis.removeEventListener("pointerdown", this.#down, true);
    //   globalThis.removeEventListener("pointermove", this.#move, true);
    //   globalThis.removeEventListener("pointercancel", this.#up, true);
    //   globalThis.removeEventListener("pointerup", this.#up, true);
    // }
    return this.#mode;
  }
}
Object.defineProperty(Gestures.prototype, Symbol.toStringTag, {
  value: "Gestures"
});
export default Gestures;

const MouseEvent = globalThis.MouseEvent || <typeof globalThis.MouseEvent>(<unknown>class { });
const TouchEvent = globalThis.TouchEvent || <typeof globalThis.TouchEvent>(<unknown>class { });
// const PointerEvent = globalThis.PointerEvent || <typeof globalThis.PointerEvent><unknown>class { };

function getTouchByIdentifer(identifier: number, touches: ArrayLike<Touch>) {
  var i = 0;
  var l = touches.length;
  for (i; i < l; i++) {
    if (touches[i].identifier == identifier) {
      return i;
    }
  }
  return -1;
}
