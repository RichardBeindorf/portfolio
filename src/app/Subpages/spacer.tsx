import { useEffect, useRef } from "react";

export default function Spacer({
  spacerHeight,
  pullDirectionProp,
  pullDirection,
}) {
  const spacerRef = useRef(null);
  // calculating top 15% since the parent has to have height auto so it can grow
  const topValue = window.innerHeight * 0.15 + "px";

  if (spacerRef.current) {
    spacerHeight
      ? (spacerRef.current.style.height = spacerHeight * 1.2 + "px")
      : (spacerRef.current.style.height = "0px");
  }

  function handleClick(e) {
    if (e.target !== e.currentTarget) return;

    if (
      pullDirection === "mid" ||
      pullDirection === "left" ||
      pullDirection === "right"
    )
      pullDirectionProp("default");
  }

  return (
    <div
      onClick={handleClick}
      id="spacer"
      ref={spacerRef}
      style={{ position: "relative", top: topValue }}
      className="spacer"
    />
  );
}
