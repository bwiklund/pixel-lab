import { State, tryEval } from "./state";

const LOCALSTORAGE_KEY = "pixel";

export function getInitState() {
  try {
    const data = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)!);
    data.fn = tryEval(data.fnTxt); // hydrate this
    return data;
  } catch (e) {
    return null;
  }
}

export function writeState(state: State) {
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state));
}
