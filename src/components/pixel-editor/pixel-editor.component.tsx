import { useEffect, useRef } from "react";

import { setupPaperCanvas } from "@/lib/setup-paper-canvas";

import { CanvasProps } from "./pixel-editor.types";
import { draw } from "./utils/draw";

export const Canvas = (props: CanvasProps) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      setupPaperCanvas(canvas);
      draw();
    }
  }, []);

  return <canvas ref={canvasRef} {...props} id="canvas" /*resize="true"*/ />;
};
