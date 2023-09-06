import { useRef, useEffect, useState } from 'react';
import { PixelEditor, Pencil } from '@curtishughes/pixel-editor';

const LAST = 20

function App() {
  const editorRef = useRef<HTMLCanvasElement>(null);
  const canvasDrawRef = useRef<HTMLCanvasElement>(null);
  const [editor, setEditor] = useState<PixelEditor>();

  useEffect(() => {
    if (editorRef.current) {
      setEditor(new PixelEditor(editorRef.current, LAST, LAST, new Pencil('black')));
    }
  }, []);

  // function getMousePos(canvas, evt) {
  //   var rect = ;
  //   return {
  //     x: evt.clientX - rect.left,
  //     y: evt.clientY - rect.top
  //   };
  // }

  

  // useEffect(()=>{
  //   console.log(editor?.history);
  // }, [editor?.get()])

  const WIDTH = 500;
  const HEIGHT = 500;



  const getCoordsByEvent = (event) => {
    if(canvasDrawRef?.current) {
      const rect = canvasDrawRef?.current?.getBoundingClientRect();
      const x =  event.clientX - rect.left;
      const y = event.clientY - rect.top;
      

      const indexX = Math.round(x * LAST / WIDTH);
      const indexY = Math.round(y * LAST / HEIGHT);

      return [indexX, indexY];
    }
    return [0, 0];
  }

  const drawPoint = (x: number, y: number) => {
    editor?.tool.handlePointerDown({ x, y }, editor)
  }

  const [isDown, setIsDown] = useState(false);
  
  const drawMirror = (x: number, y: number) => {
    drawPoint(x, y);
    drawPoint(LAST-x, y);
    drawPoint(x, LAST-y);
    drawPoint(LAST-x, LAST-y);
    // useEffect(() => {
    //   editor?.set(editor.pixels);
    //   drawPoint(LAST-x, LAST-y);
    // })
    
    
  }

  const onMouseDown = (event) => {
    setIsDown(true);
    const [iX, iY] = getCoordsByEvent(event);
    // drawMirror(iX, iY);
    drawPoint(iX, iY);
    // editor?.tool.handlePointerDown({ x: 10, y: 10 }, editor)
    editor?.tool.handlePointerDown({ x: iX, y: iY }, editor)
    
  }

  const onMouseMove = (event) => {
    const [iX, iY] = getCoordsByEvent(event);

    if(isDown) {
      drawMirror(iX, iY);
    }
  }

  const onMouseUp = (event) => {
    const [iX, iY] = getCoordsByEvent(event);
    drawMirror(iX, iY);
    setIsDown(false);
  }

  return (
    <div style={{display: 'flex'}}>
    <div className='wrapper'>
      <canvas ref={editorRef} onMouseMove={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('x')
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        // console.log('x')
        editor?.tool.handlePointerDown({x: 0, y: 0}, editor);;
      }}
      />
      <button onClick={() => { if (editor) editor.tool = new Pencil() }}>Eraser</button>
      <button onClick={() => { if (editor) editor.tool = new Pencil('black') }}>Pencil</button>
      <button onClick={() => { if (editor) editor.undo() }}>Undo</button>
      <button onClick={() => { if (editor) editor.redo() }}>Redo</button>
    </div>
    <canvas ref={canvasDrawRef} width={WIDTH} height={HEIGHT} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} />
    </div>
  );
}

export default App;