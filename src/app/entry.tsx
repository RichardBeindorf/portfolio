"use client";

import styled from "styled-components";
import { permanentMarker, oswald300 } from "../styles/font";

export const EntryWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 0.5rem;
  margin: 10px 0 10px 0;
  cursor: pointer;
  padding: 0px;
  background-color: rgba(242, 241, 233, 0);
  transition: padding 1s ease-in, background-color 1s ease-in,
    font-size 1s ease-in;

  &:hover {
    padding: 5px;
    background-color: rgba(242, 241, 233, 1);
    font-size: clamp(1vw, 1.1rem, 2vw);
    transition: padding 0.5s ease-out, background-color 0.5s ease-out,
      font-size 0.5s ease-out;
  }
`;

const Bullet = styled.span`
  color: var(--textAccent);
  font-size: 2rem;
`;

const EntryText = styled.p`
  width: max-content;
  font-size: 1.5rem;
`;

const Year = styled.span`
  font-size: 1.2rem;
`;

export default function Entry(body: string, year: number | string, id: number) {
  return (
    <div key={id}>
      <EntryWrapper>
        <Bullet>//</Bullet>
        <EntryText style={oswald300.style}>{body}</EntryText>
        <Year style={permanentMarker.style}>{year}</Year>
      </EntryWrapper>
    </div>
  );
}
