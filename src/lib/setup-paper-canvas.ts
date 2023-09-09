import Paper from "paper";

export const setupPaperCanvas = (canvas: Parameters<typeof Paper.setup>[0]) => {
  Paper.setup(canvas);
};
