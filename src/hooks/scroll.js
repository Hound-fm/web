import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const scrollToTop = () => {
  window.scrollTo(0, 0);
};

export const useScrollToTop = () => {
  const { key } = useLocation();
  useEffect(() => {
    scrollToTop();
  }, [key]);
};
