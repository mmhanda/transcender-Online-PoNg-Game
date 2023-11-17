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
