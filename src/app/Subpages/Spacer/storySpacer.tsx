import { entryData } from "@/data/storyEntries";
import styled from "styled-components";

export default function StorySpacer({ height }) {
  return (
    <Spacer $spacerHeight={height}>
      <TitleWrapper>
        <ChapterTitle>Story</ChapterTitle>
        <svg width={2} height="20" className="underline">
          <path
            d="M 0 0 Q 20 20, 500 0"
            stroke="#262626"
            strokeWidth={"2px"}
            fill="transparent"
          />
        </svg>
      </TitleWrapper>

      <StoryEntryWrapper className="contentWrapper">
        <Intro>
          "Lets say it seems <em>complicated</em>, but in the <em>end</em> it
          all makes sense"
        </Intro>
        <EntryList>
          {entryData.map((entry, i) => (
            <EntryWrapper key={i}>
              <Bullet>//</Bullet>
              <EntryText>{entry[0]}</EntryText>
              <Year>{entry[1]}</Year>
            </EntryWrapper>
          ))}
        </EntryList>
      </StoryEntryWrapper>
    </Spacer>
  );
}

const Spacer = styled.figure<{ $spacerHeight: number }>`
  height: ${(props) => {
    return props.$spacerHeight ? props.$spacerHeight : "100vh";
  }};
  visibility: hidden;

  position: relative;
  width: 100%;
  height: auto;

  pointer-events: none;
  background: transparent;
  z-index: 0;
`;

export const ChapterTitle = styled.h1`
  position: relative;
  color: var(--foreground);

  font-size: var(--header);
  text-align: center;
  user-select: none;

  &:hover {
    cursor: pointer;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  margin-bottom: 5vh;
`;

const StoryEntryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0px;
  background-color: var(--background);
`;

export const Intro = styled.div`
  /* width: max-content; */
  font-size: var(--subTitle);
  text-align: center;
  color: var(--foreground);
`;

export const EntryList = styled.div`
  margin-top: 30px;
`;

const EntryWrapper = styled.div`
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
  /* width: max-content; */
  font-size: var(--inlineText);
`;

const Year = styled.span`
  font-size: var(--inlineText);
`;
