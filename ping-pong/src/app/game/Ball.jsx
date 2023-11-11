const INITIAL_VELOCITY = 0.025;
const VELOCITY_INCREASE = 0.000001;

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
      const heading = randomNumberBetween(0, 2 * Math.PI) - 1;
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
      this.velocity = INITIAL_VELOCITY;
    }
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  update(delta, paddleRects, isAdmin, AdminX, AdminY) {
    if (isAdmin) {
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
    } else {
      this.x = 100 - AdminX;
      this.y = AdminY;
    }
  }
}

// function isCollision(rect1, rect2) {
//   return (
//     rect1.left - 1 < rect2.right + 1 &&
//     rect1.right + 1 > rect2.left - 1 &&
//     rect1.top < rect2.bottom &&
//     rect1.bottom > rect2.top
//   );
// }

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right + 4 &&
    rect1.right > rect2.left + 4 &&
    rect1.top < rect2.bottom + 4 &&
    rect1.bottom > rect2.top + 4
  );
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
