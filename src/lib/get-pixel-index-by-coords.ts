type GetPixelIndexBybCoordsProps = {
  x: number;
  y: number;
  editorWidth: number;
  editorHeight: number;
  xSize: number;
  ySize: number;
};

export const getPixelIndexByCoords = ({
  x,
  y,
  xSize,
  ySize,
  editorWidth,
  editorHeight,
}: GetPixelIndexBybCoordsProps) => ({
  idxX: Math.floor((x * xSize) / editorWidth),
  idxY: Math.floor((y * ySize) / editorHeight),
});
