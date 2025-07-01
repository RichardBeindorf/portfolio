"use client";

import styled from "styled-components";
import Story from "./story";
import Passion from "./passion";
import { useEffect, useState } from "react";
import Work from "./work";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default function LowerHalf() {
  const [currentWindow, setCurrentWindow] = useState<number[]>([]);

  return (
    <Container>
      <Story
        currentWindow={currentWindow}
        setCurrentWindow={(arr) => setCurrentWindow(arr)}
      />
      <Passion
        currentWindow={currentWindow}
        setCurrentWindow={(arr) => setCurrentWindow(arr)}
      />
      <Work
        currentWindow={currentWindow}
        setCurrentWindow={(arr) => setCurrentWindow(arr)}
      />
    </Container>
  );
}
