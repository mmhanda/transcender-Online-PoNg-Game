export default class Paddle {
  constructor(paddleElem: HTMLElement | null) {
    this.paddleElem = paddleElem;
  }

  get position() {
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }
  set position(value: number) {
    this.paddleElem.style.setProperty("--position", value);
  }

  update(Player2Height: number) {
    this.position = Player2Height;
  }
}
