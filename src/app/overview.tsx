import styled from "styled-components"

const PageTitle = styled.h1`
    position: absolute;
    color: black;
`;

export default function Overview (){

    return (
        <>
            <PageTitle> Hello World! </PageTitle>
            <PageTitle> Work </PageTitle>
            <PageTitle> Story </PageTitle>
            <PageTitle> Passion </PageTitle>
        </>
    )
}