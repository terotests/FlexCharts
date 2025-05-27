import { useEffect, useRef, useState } from "react";

export const useSwipe = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setStartX(e.pageX - (containerRef.current?.offsetLeft || 0));
      setScrollLeft(containerRef.current?.scrollLeft || 0);
    };
    const handleMouseLeave = () => {
      setIsDragging(false);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const x = e.pageX - containerRef.current!.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      containerRef.current!.scrollLeft = scrollLeft - walk;
    };
    const container = containerRef.current!;
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);
    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, startX, scrollLeft]);
  return containerRef;
};
