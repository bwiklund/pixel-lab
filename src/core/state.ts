const initFn = "(x, y, w, h) => {\n\nreturn [x / w, y / w, 1.0, 1.0];\n\n}\n";

export const initState = {
  width: 512,
  height: 512,
  fnTxt: initFn,
  fn: tryEval(initFn) as (
    x: number,
    y: number,
    w: number,
    h: number,
  ) => [number, number, number, number],
};

export type State = typeof initState;

export function tryEval(str: string): any {
  try {
    // eslint-disable-next-line
    return eval(str);
  } catch (e) {
    console.log(e);
    // TODO return tuple so we can include error message. or pick the default fn elsewhere actually...
    return () => [1, 1, 1, 1];
  }
}
