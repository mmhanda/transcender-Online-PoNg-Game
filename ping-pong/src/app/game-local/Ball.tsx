const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.000001;

export default class Ball {
  constructor(ballElem: HTMLElement | null) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }
  set x(value: number) {
    this.ballElem.style.setProperty("--x", value);
  }
  set y(value: number) {
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

  update(delta: number, paddleRects: object) {
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

function isCollision(rect: object, ballRect: object) {
  return (
    rect.left < ballRect.right + 4 &&
    rect.right > ballRect.left + 4 &&
    rect.top < ballRect.bottom + 4 &&
    rect.bottom > ballRect.top + 4
  );
}

function randomNumberBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
