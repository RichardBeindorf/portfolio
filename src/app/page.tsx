    "use client";
    import styled from "styled-components";
    import CameraSetup from "./cameraSetup";
    import { permanentMarker } from "../styles/font"; 
    import React, { useRef } from "react";
    import { Canvas } from "@react-three/fiber";
    import InteractionHandler from "./interactionHandler";
    import ScribbleFigure from "@/components/scribbleFigure"; 
    import ThreeLine, { ThreeLineMethods } from "@/components/threeLine";

    export default function Home() { 
        const threeLineRef = useRef<ThreeLineMethods | null>(null);
        return (
            <WelcomeMain>
                <CanvasWrapper>
                    <Canvas orthographic>
                        <CameraSetup />
                        <ThreeLine lineApiRef={threeLineRef} />
                        <InteractionHandler lineApiRef={threeLineRef} />
                    </Canvas>
                </CanvasWrapper>
                <TopHalf>
                    <Title style={permanentMarker.style}>
                        Hi, i`m Richard <br /> a &lt; Creative Developer /&gt; <br /> based in Hamburg
                    </Title>
                    <ScribbleFigure />
                </TopHalf>
                <LowerHalf>
                    <Story style={permanentMarker.style}> Story </Story>
                    <Work style={permanentMarker.style}> Work </Work>
                    <Passion style={permanentMarker.style}> Passion </Passion>
                </LowerHalf>
            </WelcomeMain>
        );
    }

    const WelcomeMain = styled.main`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100vw;
        height: calc(100vh * 2);
        background-color: #F2F1E9;
        overflow-y: hidden; // debatable

        /* pointer-events: none; */ /* causes a lot of bugs! use with care */
    `;

    const CanvasWrapper = styled.div`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(100vh * 2);
    `;

    const TopHalf = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
    `;

    const LowerHalf = styled(TopHalf)`
    `;

    const Title = styled.h1`
        color: #F24150;
        font-size: clamp(2vw, 3rem, 4.5vw);
        text-align: center;
        z-index: 3;
    `;

    const Work = styled(Title)`
        position: absolute;
        top: 1400px;
        left: 200px;
        color: var(--foreground);
    `;

    const Passion = styled(Title)`
        position: absolute;
        top: 140%;
        left: 80%;
        color: var(--foreground);
    `;

    const Story = styled(Title)`
        position: absolute;
        top: 170%;
        left: 50%;
        color: var(--foreground);
    `;