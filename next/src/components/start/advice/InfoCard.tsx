import Image, { StaticImageData } from "next/image";
import styled from "styled-components";
import { device } from "../../../styles/device";

const InfoCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  border: 5px solid #BEB8E7;

  margin: 10px 0px;

  @media ${device.laptop} {
    width: 224px;
  }

  @media ${device.laptopL} {
    width: 320px;
  }

  @media ${device.desktop} {
    width: 405px;
  }
`;

const InfoCardImageContainer = styled.div`
  position: relative;
  height: 220px;

  @media ${device.laptop} {
    height: 180px;
  }

  @media ${device.laptopL} {
    height: 225px;
  }

  @media ${device.desktop} {
    height: 270px;
  }
`;

const InfoCardBottomContainer = styled.div`
  display: flex;
  flex-direction: column;  
  border-top: 5px solid #BEB8E7;
  height: 220px;
  padding: 8px;

  @media ${device.laptop} {
    height: 180px;
    padding: 8px;
  }

  @media ${device.laptopL} {
    height: 225px;
    padding: 12px;
  }

  @media ${device.desktop} {
    height: 270px;
    padding: 16px;
  }
`;

const InfoCardHeader = styled.div`
  font-weight: bold;
  font-size: 24px;
  padding-bottom: 4px;

  @media ${device.laptop} {
    font-size: 24px;
    padding-bottom: 8px;
  }
  @media ${device.laptopL} {
    font-size: 28px;
    padding-bottom: 12px;
  }
  @media ${device.desktop} {
    font-size: 32px;
    padding-bottom: 16px;
  }
`

const InfoCardBody = styled.div`
  font-size: 14px;

  @media ${device.laptop} {
    font-size: 12px;
  }
  @media ${device.laptopL} {
    font-size: 14px;
  }
  @media ${device.desktop} {
    font-size: 16px;
  }
`;

const Button = styled.button`
  display: flex;
  margin-top: auto;
	outline: none;
  border: 0;
  border-radius: 5px;
	font-weight: bold;
  color: white;
  justify-content: center;
  align-items: center;
  background-color: #BEB8E7;
  cursor: pointer;
  :hover {
    background-image: linear-gradient(rgb(0 0 0/40%) 0 0);
  }

  font-size: 20px;
  height: 40px;

  @media ${device.laptop} {
    font-size: 16px;
    height: 32px;
  }
  @media ${device.laptopL} {
    font-size: 20px;
    height: 40px;
  }
  @media ${device.desktop} {
    font-size: 24px;
    height: 48px;
  }
`;

type Props = {
  title: string;
  text: string;
  image: StaticImageData;
  link: string;
};

export default function InfoCard({ title, text, image, link }: Props) {
  return (
    <InfoCardContainer>
      <InfoCardImageContainer>
        <Image src={image} alt="asdfasdf" objectFit="cover" layout="fill" />
      </InfoCardImageContainer>
      <InfoCardBottomContainer>
        <InfoCardHeader>
          {title}
        </InfoCardHeader>
        <InfoCardBody>
          {text}
        </InfoCardBody>
        <Button as="a" href={link} target="_blank" rel="noreferrer">
          Read More
        </Button>
      </InfoCardBottomContainer>
    </InfoCardContainer>
  )
}