import { useEffect } from "react";

export function useDebounce(
  debounceFunction,
  monitoringVariables = [],
  debounceTime = 500
) {
  return useEffect(() => {
    let timer = setTimeout(debounceFunction, debounceTime);
    return () => {
      clearTimeout(timer);
    };
    
  // eslint-disable-next-line
  }, monitoringVariables);
}
