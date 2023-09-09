import Paper, { Color, Group, Point, Size } from "paper";

import { createRoundRectangle } from "@/lib/create-round-rectangle";
import { getPixelIndexByCoords } from "@/lib/get-pixel-index-by-coords";
import { TPaperMouseEvent, TPath, TPoint } from "@/types";

const editorParams = {
  editorWidth: 600,
  editorHeight: 600,
  xSize: 31,
  ySize: 31,
} as const;

export const draw = () => {
  const { editorWidth, editorHeight, xSize, ySize } = editorParams;

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
      });

      pixel.parent = parentGroup;
      pixel.fillColor = new Color("black");
      pixels.push(pixel);
    }
  }

  const mirrorDraw = ({ point }: TPaperMouseEvent) => {
    const fillColor = new Color("grey");

    const { x, y } = point;

    const drawPointsInMatrix: TPoint[] = [
      { x, y },
      { x: editorWidth - x, y },
      { x, y: editorHeight - y },
      { x: editorWidth - x, y: editorHeight - y },
    ] as TPoint[];

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

  const selectedPixel = createRoundRectangle({
    putOnPoint: new Point(-100, -100),
    boxSize: sizeOfRectangle,
    cornersSize: {
      topLeft: null,
      topRight: cornerSize,
      bottomLeft: cornerSize,
      bottomRight: null,
    },
  });

  const selectColor = new Color("rgba(100,100,100,0.5)");
  selectedPixel.fillColor = selectColor;

  const drawSelectedPixel = ({ point }: TPaperMouseEvent) => {
    const { x, y } = point;

    const { idxX, idxY } = getPixelIndexByCoords({
      x,
      y,
      ...editorParams,
    });

    const idx = idxX * ySize + idxY;

    selectedPixel.position.x = pixels[idx].position.x;
    selectedPixel.position.y = pixels[idx].position.y;
  };

  Paper.view.onMouseDown = (event: TPaperMouseEvent) => {
    mirrorDraw(event);
    console.log(event.target.bounds);
  };

  Paper.view.onMouseDrag = (event: TPaperMouseEvent) => {
    mirrorDraw(event);
  };

  Paper.view.onMouseMove = (event: TPaperMouseEvent) => {
    drawSelectedPixel(event);
  };
};
