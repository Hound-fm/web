import { useEffect, useCallback } from "react";

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
  }, monitoringVariables);
}

export function useDebounceCallback(
  debounceFunction,
  monitoringVariables = [],
  debounceTime = 500
) {
  return useCallback((params) => {
    let timer = setTimeout(() => debounceFunction(params), debounceTime);
    return () => {
      clearTimeout(timer);
    };
  }, monitoringVariables);
}
