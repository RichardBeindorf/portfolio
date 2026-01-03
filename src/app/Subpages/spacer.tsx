import { useRef } from "react";

export default function Spacer({ spacerHeight }: { spacerHeight: number }) {
  const spacerRef = useRef(null);

  console.log("new spacer height!", spacerHeight);

  if (spacerRef.current) {
    spacerHeight
      ? (spacerRef.current.style.height = spacerHeight + "px")
      : (spacerRef.current.style.height = "0px");
  }
  return <div id="spacer" ref={spacerRef} />;
}
