import styled from "styled-components";

export type FooterProps = {
    variant?: string;
}
export const StyledFooter = styled.footer<FooterProps>`
    background: #5282FF;
    padding: 0.25rem;
    display: inline-grid;
    text-align: right;
    width: 80%;
    bottom: 0;
    position: fixed;
    left: 10%;
`;