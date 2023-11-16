const INITIAL_VELOCITY = 0.030;
const VELOCITY_INCREASE = 0.00000;

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
    this.x = 22.5;
    this.y = 50;

    const direction_ = Math.random() * Math.PI * 0.8 - (Math.PI * 0.8) / 2;
    this.direction = {
      x: Math.random() < 0.5 ? -1 : 1 * Math.cos(direction_),
      y: Math.sin(direction_),
    };
    this.velocity = INITIAL_VELOCITY;
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  update(delta: number, paddleRects: object, isAdmin: boolean, AdminX: number, AdminY: number) {
    if (isAdmin) {
      this.x += this.direction.x * this.velocity * delta;
      this.y += this.direction.y * this.velocity * delta;
      this.velocity += VELOCITY_INCREASE * delta;

      const rect = this.rect();

      if (rect.bottom >= window.innerHeight || rect.top <= 0) {
        this.direction.y *= -1;
      } else if (paddleRects.some((r: any) => isCollision(r, rect))) {
        this.direction.x *= -1;
      }
    } else {
      this.x = 45 - AdminX;
      this.y = AdminY;
    }
  }
}

function isCollision(rect: object, BallRect: object) {
  return (
    rect.left < BallRect.right &&
    rect.right > BallRect.left &&
    rect.top < BallRect.bottom &&
    rect.bottom > BallRect.top
  );
}
