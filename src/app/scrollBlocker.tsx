"use client";
import { useEffect } from "react";

export default function IOSScrollBlock() {
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      // const scrollable = (e.target as HTMLElement)?.closest(".scrollable");
      // if (!scrollable) {
      e.preventDefault(); // block background scroll
      console.log(e);
      // }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
}
