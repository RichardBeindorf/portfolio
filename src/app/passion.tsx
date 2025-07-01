import styled from "styled-components";
import { ChapterContainer, ChapterTitle, CurrentWindow } from "./story";
import { permanentMarker } from "@/styles/font";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const PassionContainer = styled(ChapterContainer)`
  left: 10%;
  top: 70%;
`;

const Title = styled(ChapterTitle)``;

export default function Passion({
  currentWindow,
  setCurrentWindow,
}: CurrentWindow) {
  const tainer = useRef(null);
  const title = useRef(null);
  const [clicked, setClicked] = useState(false);

  const { contextSafe } = useGSAP(
    () => {
      const onClickIn = contextSafe(() => {
        gsap.to(tainer.current, {
          top: "60%",
          duration: 2,
          //   backgroundColor: "rgba(242, 241, 233, 0.8)",
          ease: "power4.out",
        });
        gsap.to(title.current, {
          fontSize: "clamp(8vw, 6rem, 11vw)",
          color: "#F24150",
          duration: 2,
          ease: "power4.out",
        });
      });

      const onClickOut = contextSafe(() => {
        gsap.to(tainer.current, {
          top: "85%",
          duration: 2,
          ease: "power4.out",
          //   backgroundColor: "rgba(242, 241, 233, 0)",
        });
        gsap.to(title.current, {
          fontSize: "clamp(2vw, 3rem, 4.5vw)",
          color: "#262626",
          duration: 2,
          ease: "power4.out",
        });
      });

      clicked ? onClickIn() : onClickOut();
    },
    {
      scope: tainer,
      dependencies: [clicked, currentWindow],
      revertOnUpdate: false,
    }
  );

  return (
    <PassionContainer
      onClick={() => {
        const next = !clicked;
        setClicked(next);
        setCurrentWindow(next ? [1, 0, 0] : [0, 0, 0]);
      }}
      ref={tainer}
    >
      <Title style={permanentMarker.style} ref={title}>
        Passion
      </Title>
    </PassionContainer>
  );
}
