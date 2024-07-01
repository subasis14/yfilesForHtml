import { ShapeNodeStyle, SolidColorFill } from "yfiles";

export class BigNode extends ShapeNodeStyle {
  constructor() {
    super({
      fill: new SolidColorFill("#E0DDDD"),
      stroke: null,
    });
  }
}
