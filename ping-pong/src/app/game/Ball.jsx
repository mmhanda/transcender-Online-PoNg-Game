const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.000002;

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }
  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }
  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }
  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  reset() {
    this.x = 50;
    this.y = 50;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
      this.velocity = INITIAL_VELOCITY;
    }
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  update(delta, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;

    const rect = this.rect();

    if (rect.bottom >= window.innerHeight || rect.top <= 0) {
      this.direction.y *= -1;
    }
    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
    }
  }
}

function isCollision(rect1, rect2) {
  return (
    rect1.left + 1 < rect2.right - 1 &&
    rect1.right + 1 > rect2.left - 1 &&
    rect1.top + 1 < rect2.bottom - 1 &&
    rect1.bottom + 1 > rect2.top - 1
  );
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
