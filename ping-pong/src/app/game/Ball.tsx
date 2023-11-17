export default class Ball {
  constructor(ballElem: HTMLElement | null) {
    this.ballElem = ballElem;
  }

  set x(value: number) {
    this.ballElem.style.setProperty("--x", value);
  }
  set y(value: number) {
    this.ballElem.style.setProperty("--y", value);
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
