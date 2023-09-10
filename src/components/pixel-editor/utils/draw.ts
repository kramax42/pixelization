import Paper, { Color, Group, Point, Size } from "paper";

import { createRoundRectangle } from "@/lib/create-round-rectangle";
import { getPixelIndexByCoords } from "@/lib/get-pixel-index-by-coords";
import { TPaperMouseEvent, TPath, TPoint } from "@/types";

const editorParams = {
  editorWidth: 600,
  editorHeight: 600,
  xSize: 61,
  ySize: 61,
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

  const CORNER_RADIUS = 5;
  const sizeOfRectangle = new Size(rectWidth, rectHeight);
  const cornerSize = new Size(CORNER_RADIUS, CORNER_RADIUS);

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
          topRight: cornerSize,
          bottomLeft: cornerSize,
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

  const mirrorDraw = ({ point }: TPaperMouseEvent) => {
    const fillColor = brushColor;
    const drawPointsInMatrix = getMirrorDrawingPointsInMatrixByCoords(point);

    drawPointsInMatrix.forEach(({ x, y }) => {
      const { idxX, idxY } = getPixelIndexByCoords({
        x,
        y,
        ...editorParams,
      });
      const idx = idxX * ySize + idxY;
      pixels[idx].fillColor = fillColor;
    });
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

      const idx = idxX * ySize + idxY;

      selectedPixel.position.x = pixels[idx].position.x;
      selectedPixel.position.y = pixels[idx].position.y;
    });
  };

  Paper.view.onMouseDown = (event: TPaperMouseEvent) => {
    mirrorDraw(event);
    console.log(event.target.bounds);
  };

  Paper.view.onMouseDrag = (event: TPaperMouseEvent) => {
    mirrorDraw(event);
  };

  Paper.view.onMouseMove = (event: TPaperMouseEvent) => {
    drawSelectedPixels(event);
  };
};
