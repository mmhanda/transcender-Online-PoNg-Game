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

  update(Player2Height) {
    this.position = Player2Height;
  }

  reset() {
    this.position = 40;
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }
}

export const customStyles = {
  overlay: {
    backgroundColor: "rgba(3, 3, 3, 0.6)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
