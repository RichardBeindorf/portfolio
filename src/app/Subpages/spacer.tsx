import { useRef } from "react";

export default function Spacer({ spacerHeight }: { spacerHeight: number }) {
  const spacerRef = useRef(null);
  // calculating top 15% since the parent has to have height auto so it can grow
  const topValue = window.innerHeight * 0.15 + "px";
  console.log("new spacer height!", spacerHeight);

  if (spacerRef.current) {
    spacerHeight
      ? (spacerRef.current.style.height = spacerHeight * 1.3 + "px")
      : (spacerRef.current.style.height = "0px");
  }
  return (
    <div
      id="spacer"
      ref={spacerRef}
      style={{ position: "relative", top: topValue }}
    />
  );
}
