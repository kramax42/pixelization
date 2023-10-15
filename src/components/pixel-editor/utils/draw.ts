import Paper, { Color, Group, Point, Size } from "paper";

import { createRoundRectangle } from "@/lib/create-round-rectangle";
import { getPixelIndexByCoords } from "@/lib/get-pixel-index-by-coords";
import { TPaperMouseEvent, TPath, TPoint, TSize } from "@/types";

const editorParams = {
  editorWidth: 600,
  editorHeight: 600,
  xSize: 31,
  ySize: 31,
  backgroundColor: new Color("black"),
  brushColor: new Color("grey"),
  brushHoverColor: new Color("rgba(100, 100, 100, 0.5)"),
} as const;

export const draw = () => {
  const {
    editorWidth,
    editorHeight,
    xSize,
    ySize,
    backgroundColor,
    brushColor,
    brushHoverColor,
  } = editorParams;

  const rectWidth = editorWidth / xSize;
  const rectHeight = editorHeight / ySize;

  const pixels: TPath[] = [];
  const parentGroup = new Group();

  const CORNER_RADIUS = 12;
  const sizeOfRectangle = new Size(rectWidth, rectHeight);
  const cornerSize = new Size(CORNER_RADIUS, CORNER_RADIUS);

  const getPixel = (i: number, j: number) => {
    const idx = i * ySize + j;
    return pixels[idx];
  };

  for (let i = 0; i < xSize; i += 1) {
    for (let j = 0; j < ySize; j += 1) {
      const position = {
        x: i * rectWidth,
        y: j * rectHeight,
      };

      const pointToPlot = new Point(position.x, position.y);

      const pixel = createRoundRectangle({
        putOnPoint: pointToPlot,
        boxSize: sizeOfRectangle,
        cornersSize: {
          topLeft: null,
          topRight: null,
          bottomLeft: null,
          bottomRight: null,
        },
        fillColor: backgroundColor,
      });

      pixel.parent = parentGroup;
      pixels.push(pixel);
    }
  }
  const getMirrorDrawingPointsInMatrixByCoords = ({ x, y }: TPoint) => [
    new Point(x, y),
    new Point(editorWidth - x, y),
    new Point(x, editorHeight - y),
    new Point(editorWidth - x, editorHeight - y),
  ];

  const auxiliaryRoundCornersPixels: TPath[] = [];

  // TODO: replace all pixels recalculation with only one
  const redrawAuxiliaryRoundCornersPixels = () => {
    auxiliaryRoundCornersPixels.forEach(pixel => pixel.remove());
    auxiliaryRoundCornersPixels.length = 0;

    const getAuxiliaryRoundCornersSizes = (i: number, j: number) => {
      const cornersSize: Record<string, TSize | null> = {
        topLeft: null,
        topRight: null,
        bottomLeft: null,
        bottomRight: null,
      };

      if (i - 1 >= 0 && j - 1 >= 0) {
        const topPixel = getPixel(i - 1, j);
        const leftPixel = getPixel(i, j - 1);

        if (
          topPixel.fillColor?.equals(brushColor) &&
          leftPixel.fillColor?.equals(brushColor)
        ) {
          cornersSize.topLeft = cornerSize;
        }
      }

      if (i - 1 >= 0 && j + 1 <= ySize) {
        const topPixel = getPixel(i - 1, j);
        const rightPixel = getPixel(i, j + 1);

        if (
          topPixel.fillColor?.equals(brushColor) &&
          rightPixel.fillColor?.equals(brushColor)
        ) {
          // cornersSize.topRight = cornerSize;
          cornersSize.bottomLeft = cornerSize;
        }
      }

      if (i + 1 <= xSize && j + 1 <= ySize) {
        const bottomPixel = getPixel(i + 1, j);
        const rightPixel = getPixel(i, j + 1);

        if (
          bottomPixel.fillColor?.equals(brushColor) &&
          rightPixel.fillColor?.equals(brushColor)
        ) {
          cornersSize.bottomRight = cornerSize;
        }
      }

      if (i + 1 <= xSize && j - 1 >= 0) {
        const bottomPixel = getPixel(i + 1, j);
        const leftPixel = getPixel(i, j - 1);

        if (
          bottomPixel.fillColor?.equals(brushColor) &&
          leftPixel.fillColor?.equals(brushColor)
        ) {
          // cornersSize.bottomLeft = cornerSize;
          cornersSize.topRight = cornerSize;
        }
      }

      return cornersSize;
    };

    for (let i = 0; i < xSize; i += 1) {
      for (let j = 0; j < ySize; j += 1) {
        const position = {
          x: i * rectWidth,
          y: j * rectHeight,
        };

        if (getPixel(i, j).fillColor?.equals(brushColor)) {
          continue;
        }

        const cornersSize = getAuxiliaryRoundCornersSizes(i, j);

        if (
          cornersSize.bottomLeft ||
          cornersSize.bottomRight ||
          cornersSize.topLeft ||
          cornersSize.topRight
        ) {
          const pixelCorner = createRoundRectangle({
            putOnPoint: new Point(position.x, position.y),
            boxSize: sizeOfRectangle,
            cornersSize: cornersSize,
            // fillColor: backgroundColor,
            fillColor: brushHoverColor,
          });

          const pixelFull = createRoundRectangle({
            putOnPoint: new Point(position.x, position.y),
            boxSize: sizeOfRectangle,
            cornersSize: {
              topLeft: null,
              topRight: null,
              bottomLeft: null,
              bottomRight: null,
            },
            // fillColor: backgroundColor,
            fillColor: brushColor,
          });

          const pixel = pixelFull.subtract(pixelCorner);

          pixelFull.remove();
          pixelCorner.remove();

          pixel.parent = parentGroup;
          auxiliaryRoundCornersPixels.push(pixel);
        }
      }
    }
  };

  const mirrorDraw = ({ point }: TPaperMouseEvent) => {
    const fillColor = brushColor;
    const drawPointsInMatrix = getMirrorDrawingPointsInMatrixByCoords(point);

    drawPointsInMatrix.forEach(({ x, y }) => {
      const { idxX, idxY } = getPixelIndexByCoords({
        x,
        y,
        ...editorParams,
      });

      const pixel = getPixel(idxX, idxY);

      pixel.fillColor = fillColor;
    });

    redrawAuxiliaryRoundCornersPixels();
  };

  const selectedPixels = getMirrorDrawingPointsInMatrixByCoords(
    new Point(-100, -100)
  ).map(point =>
    createRoundRectangle({
      putOnPoint: point,
      boxSize: sizeOfRectangle,
      cornersSize: {
        topLeft: null,
        topRight: cornerSize,
        bottomLeft: cornerSize,
        bottomRight: null,
      },
      fillColor: brushHoverColor,
    })
  );

  const drawSelectedPixels = ({ point }: TPaperMouseEvent) => {
    const drawPointsInMatrix = getMirrorDrawingPointsInMatrixByCoords(point);

    selectedPixels.forEach((selectedPixel, selectedPixelIndex) => {
      const { x, y } = drawPointsInMatrix[selectedPixelIndex];
      const { idxX, idxY } = getPixelIndexByCoords({
        x,
        y,
        ...editorParams,
      });

      const pixel = getPixel(idxX, idxY);

      selectedPixel.position.x = pixel.position.x;
      selectedPixel.position.y = pixel.position.y;
    });
  };

  Paper.view.onMouseDown = (event: TPaperMouseEvent) => {
    mirrorDraw(event);
  };

  Paper.view.onMouseDrag = (event: TPaperMouseEvent) => {
    mirrorDraw(event);
  };

  Paper.view.onMouseMove = (event: TPaperMouseEvent) => {
    drawSelectedPixels(event);
  };
};
