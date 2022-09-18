import styled from "styled-components";

export const SponsorsContainer = styled.div`
  margin: 4rem;
  font-family: 'Raleway';
`

export const SponsorsHeading = styled.div`
  font-weight: 800;
  font-size: 40px;
  padding: 3rem 0;
`

export const SponsorsTier = styled.div`
  font-family: 'Raleway';
  font-weight: 450;
  font-size: 25px;
`

export const SponsorsLogo = styled.div`
  padding: 1rem 2rem;
  &:hover {
    transform: scale(1.04);
  }
  &:active {
    transform: scale(0.96);
  }
  cursor: pointer;
`

export const SponsorsModal = styled.div`
  width: 35vw;  
  height: max-content;
  background: #ffffff;
  border-color: none;
  border-radius: 5px;
  padding: 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: 'Raleway';
`

export const SponsorsTitle = styled.div`
  font-weight: 470;
  font-size: 25px;
`

export const SponsorsInfo = styled.div`
  color: grey;
  font-weight: 300;
  font-size: 17px;
  line-height: 27pt;
  padding-top: 1rem;
  word-wrap: break-word;
  a{
    color: #44a6c6;
    text-decoration: underline;
  }
`

export const LevelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-between;
  flex-wrap: wrap;
  border-left: 1px solid grey;
  padding-left: 2rem;
  margin: 4rem 2rem;
`