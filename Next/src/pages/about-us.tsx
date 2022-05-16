import Sphere from './assets/ReusableSpheres';
import styled from "styled-components";

const AboutUsPage = styled.div`
    position: relative;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const AboutUsContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`

export type positionProps = {
    left?: number;
    top?: number;
}

const SpherePositioning = styled.div<positionProps>`
    position: absolute;
    z-index: -1;
    left: ${props => props.left}%;
    top: ${props => props.top}%;
`

const MainTitle = styled.div`
    align-self: flex-end;
    color: #A09FE3;
    font-family: 'Raleway';
    font-weight: 850;
    font-size: 49px;
    line-height: 4vh;
    text-align: center;
    text-shadow: 0px 0px;
    margin-top: 30vh;
`

const MainRect = styled.div`
    max-width: 60vw;
    background: #A09FE3;
    border-radius: 1vw;
    color: #FFFFFF;
    font-family: 'Raleway';
    font-weight: 300;
    font-size: 20px;
    line-height: 4vh;
    text-align: center;
    text-shadow: 0px 0px;
    padding: 3vh 2vw;
    margin-top: 30px;
`;

const BlueColor = styled.div`
    color: #3977F8;
`

const AboutUs = () => (
    <div>
        <AboutUsPage>
            <AboutUsContent>
                <MainTitle>
                    About Us
                </MainTitle>
                <MainRect>
                    We are one of the biggest and most active societies at UNSW, catering to over 3500 CSE students spanning across degrees in Computer Science, Software Engineering, Bioinformatics and Computer Engineering.
                </MainRect>
            </AboutUsContent>
            <SpherePositioning left={13} top={26}>
                <Sphere {...args1} />
            </SpherePositioning>
            <SpherePositioning left={46.04} top={43}>
                <Sphere {...args2} />
            </SpherePositioning>
            <SpherePositioning left={12} top={82}>
                <Sphere {...args3} />
            </SpherePositioning>
            <SpherePositioning left={71} top={82}>
                <Sphere {...args4} />
            </SpherePositioning>
        </AboutUsPage>
    </div>
)

const args1 = {
    size: 215,
    colourMain: "#969DC7",
    colourSecondary: "#DAE9FB",
    startMainPoint: -12,
    startSecondaryPoint: 76.59,
    angle: 261.11,
    blur: 3.5,
    rotation: 93.47,
}

const args2 = {
    size: 160,
    colourMain: "#D0E0ED",
    colourSecondary: "#498AC1",
    startMainPoint: 10.97,
    startSecondaryPoint: 99.56,
    angle: 261.11,
    blur: 3,
}
const args3 = {
    size: 175,
    colourMain: "#9B9BE1",
    colourSecondary: "#E8CAFF",
    startMainPoint: -12,
    startSecondaryPoint: 76.59,
    angle: 261.11,
    rotation: -74.2,
}

const args4 = {
    size: 278,
    colourMain: "#0069E7",
    colourSecondary: "#BDDBFF",
    startMainPoint: -10.14,
    startSecondaryPoint: 81.0,
    angle: 155.55,
    rotation: 96.49,
}

export default AboutUs