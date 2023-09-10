import { Color, Path, Point, Segment } from "paper";

import { TColor, TPoint, TSize } from "@/types";

type CornerSize = TSize | null;

type CreateRoundRectangleProps = {
  putOnPoint: TPoint;
  boxSize: TSize;
  cornersSize: {
    topLeft: CornerSize;
    topRight: CornerSize;
    bottomLeft: CornerSize;
    bottomRight: CornerSize;
  };
  fillColor?: TColor;
  strokeColor?: TColor;
};

export const createRoundRectangle = ({
  putOnPoint,
  boxSize,
  cornersSize,
  fillColor = new Color("grey"),
  strokeColor = new Color("none"),
}: CreateRoundRectangleProps) => {
  const topLeftPoint = putOnPoint;
  const topRightPoint = topLeftPoint.add(new Point(boxSize.width, 0));
  const bottomRightPoint = topRightPoint.add(new Point(0, boxSize.height));
  const bottomLeftPoint = bottomRightPoint.subtract(
    new Point(boxSize.width, 0)
  );

  const rectPath = new Path();
  rectPath.closed = true;

  if (cornersSize.topLeft) {
    const firstPoint = putOnPoint.add(new Point(0, cornersSize.topLeft.height));
    const lastPoint = putOnPoint.add(new Point(cornersSize.topLeft.width, 0));

    const firstSegment = new Segment(firstPoint, undefined, {
      x: 0,
      y: (cornersSize.topLeft.height * -1) / 2,
    });
    const secondSegment = new Segment(
      lastPoint,
      {
        x: (cornersSize.topLeft.width * -1) / 2,
        y: 0,
      },
      undefined
    );
    rectPath.add(firstSegment, secondSegment);
  } else {
    rectPath.add(topLeftPoint);
  }

  if (cornersSize.topRight) {
    const firstPoint = topRightPoint.subtract(
      new Point(cornersSize.topRight.width, 0)
    );
    const lastPoint = topRightPoint.add(
      new Point(0, cornersSize.topRight.height)
    );

    const firstSegment = new Segment(firstPoint, undefined, {
      y: 0,
      x: (cornersSize.topRight.width * 1) / 2,
    });
    const secondSegment = new Segment(
      lastPoint,
      {
        y: (cornersSize.topRight.height * -1) / 2,
        x: 0,
      },
      undefined
    );
    rectPath.add(firstSegment, secondSegment);
  } else {
    rectPath.add(topRightPoint);
  }

  if (cornersSize.bottomRight) {
    const firstPoint = bottomRightPoint.subtract(
      new Point(0, cornersSize.bottomRight.height)
    );
    const lastPoint = bottomRightPoint.subtract(
      new Point(cornersSize.bottomRight.width, 0)
    );

    const firstSegment = new Segment(firstPoint, undefined, {
      x: 0,
      y: (cornersSize.bottomRight.height * 1) / 2,
    });
    const secondSegment = new Segment(
      lastPoint,
      {
        x: (cornersSize.bottomRight.width * 1) / 2,
        y: 0,
      },
      undefined
    );
    rectPath.add(firstSegment, secondSegment);
  } else {
    rectPath.add(bottomRightPoint);
  }

  if (cornersSize.bottomLeft) {
    const firstPoint = bottomLeftPoint.add(
      new Point(cornersSize.bottomLeft.width, 0)
    );
    const lastPoint = bottomLeftPoint.subtract(
      new Point(0, cornersSize.bottomLeft.height)
    );

    const firstSegment = new Segment(firstPoint, undefined, {
      y: 0,
      x: (cornersSize.bottomLeft.width * -1) / 2,
    });
    const secondSegment = new Segment(
      lastPoint,
      {
        y: (cornersSize.bottomLeft.height * 1) / 2,
        x: 0,
      },
      undefined
    );
    rectPath.add(firstSegment, secondSegment);
  } else {
    rectPath.add(bottomLeftPoint);
  }

  rectPath.fillColor = fillColor;
  rectPath.strokeColor = strokeColor;
  rectPath.strokeWidth = 0;

  return rectPath;
};
