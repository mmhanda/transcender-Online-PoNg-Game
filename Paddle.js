const SPEED = 0.2;

export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
    this.reset();
  }

  get position () {
    return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue('--position'));
  }
  set position (value) {
    this.paddleElem.style.setProperty('--position', value);
  }

  update (delta, ballHeight) {
    this.position += SPEED * delta * ( ballHeight - this.position + 2);
  }

  reset () {
    this.position = 50;
  }

  rect () {
    return this.paddleElem.getBoundingClientRect();
  }
}