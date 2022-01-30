import { useState } from "react";

export function useSessionStorageState(key) {
  const [state, setState] = useState(sessionStorage.getItem(key))
  const setterWithStorage = arg => {
    let updatedState;
    if (typeof state === 'function') {
      updatedState = arg(state);
    } else {
      updatedState = arg;
    }
    sessionStorage.setItem(key, updatedState);
    setState(updatedState);
  }
  return [state, setterWithStorage]
}
