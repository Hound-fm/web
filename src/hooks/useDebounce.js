import { useEffect } from "react";

export default function useDebounce(
  debounceFunction,
  monitoringVariables = [],
  debounceTime = 500
) {
  return useEffect(() => {
    let timer = setTimeout(debounceFunction, debounceTime);
    return () => {
      clearTimeout(timer);
    };
  }, monitoringVariables);
}
