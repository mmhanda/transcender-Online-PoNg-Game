const SPEED = 0.1;

let resist = 0;
let decide = 1;

export default class Paddle {
  constructor(paddleElem: HTMLElement | null) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }
  set position(value: number) {
    this.paddleElem.style.setProperty("--position", value);
  }

  update(delta: number, ballHeight: number) {
    this.position += SPEED * delta * (ballHeight - this.position + resist);

    if (decide >= 0) {
      resist += 0.001;
    } else {
      resist -= 0.001;
    }
  }

  reset() {
    this.position = 50;
    resist = 0;
    decide = decide * -1;
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }
}