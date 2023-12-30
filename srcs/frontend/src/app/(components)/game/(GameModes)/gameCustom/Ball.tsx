export default class Ball {

  private ballElem: HTMLElement | null;

  constructor(ballElem: HTMLElement | null) {
    this.ballElem = ballElem;
  }

  set x(value: number) {
    this.ballElem!.style.setProperty("--x", value.toString());
  }
  set y(value: number) {
    this.ballElem!.style.setProperty("--y", value.toString());
  }

  update(isAdmin: boolean, AdminX: number, AdminY: number) {
    if (isAdmin) {
      this.x = AdminX;
      this.y = AdminY;
    } else {
      this.x = 100 - AdminX;
      this.y = AdminY;
    }
  }
}
