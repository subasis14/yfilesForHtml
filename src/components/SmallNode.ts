import {
  ShapeNodeStyle,
  SolidColorFill,
  ILabelModelParameter,
  ExteriorLabelModel,
} from "yfiles";

export class SmallNode extends ShapeNodeStyle {
  constructor() {
    super({
      fill: new SolidColorFill("#9D9897"),
      stroke: null,
    });
  }

  getLabelParameter(): ILabelModelParameter {
    return new ExteriorLabelModel({ insets: 5 }).createParameter("east");
  }
}
