const SPEED = 0.2;

let resist = 0;
let decide = 1;

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }
  set position(value) {
    this.paddleElem.style.setProperty("--position", value);
  }

  update(delta, ballHeight) {
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
