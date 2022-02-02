import { useCallback, useState } from "react";

export function useSessionStorageState(key, init = null) {
  const [state, setState] = useState(JSON.parse(sessionStorage.getItem(key)) || init)

  const setterWithStorage = useCallback(arg => {
    setState(state => {
      let updatedState;
      if (typeof arg === 'function') {
        updatedState = arg(state);
      } else {
        updatedState = arg;
      }
      sessionStorage.setItem(key, JSON.stringify(updatedState));
      return updatedState
    })
  }, [key])

  return [state, setterWithStorage]
}
