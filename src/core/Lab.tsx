import styled from "@emotion/styled";
import React from "react";
import { getInitState, writeState } from "./serialize";
import { initState, State, tryEval } from "./state";

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background: #222224;
  color: white;
`;
const Header = styled.div``;
const Code = styled.div`
  textarea {
    width: 512px;
    height: 512px;
  }
`;

export function Lab() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [s, set] = React.useState<State>(() => getInitState() || initState);
  React.useEffect(() => writeState(s), [s]);

  React.useEffect(() => {
    const canvas = canvasRef.current!;
    try {
      const w = s.width;
      const h = s.height;
      const upscale = 2;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = upscale * w + "px";
        canvas.style.height = upscale * h + "px";
        canvas.style.imageRendering = "pixelated";
      }
      const ctx = canvas.getContext("2d")!;

      const id = ctx.getImageData(0, 0, w, h);

      try {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = x + y * w;
            const rgba = s.fn(x, y, w, h);
            const i4 = i * 4;
            id.data[i4 + 0] = rgba[0] * 255;
            id.data[i4 + 1] = rgba[1] * 255;
            id.data[i4 + 2] = rgba[2] * 255;
            id.data[i4 + 3] = rgba[3] * 255;
          }
        }
      } catch (e) {
        console.log(e);
        // show error as text somewhere
      }

      ctx.putImageData(id, 0, 0);
    } catch (e) {
      console.log(e);
    }
  }, [s]);

  return (
    <Wrap>
      <Header>Pixel Lab</Header>
      <input
        type="number"
        value={s.width}
        onChange={(e) => set({ ...s, width: +e.currentTarget.value })}
      />
      <input
        type="number"
        value={s.height}
        onChange={(e) => set({ ...s, height: +e.currentTarget.value })}
      />
      <canvas ref={canvasRef} />
      <Code>
        <textarea
          value={s.fnTxt}
          onChange={(e) =>
            set({
              ...s,
              fnTxt: e.currentTarget.value,
              fn: tryEval(e.currentTarget.value),
            })
          }
        />
      </Code>
    </Wrap>
  );
}
