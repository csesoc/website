import Sphere from '../components/aboutus/ReusableSpheres';
import * as PageStyle from '../components/aboutus/AboutUs-Styled';

const args1 = {
    left: 11,
    top: 7,
    size: 13,
    colourMain: "#969DC7",
    colourSecondary: "#DAE9FB",
    startMainPoint: -12,
    startSecondaryPoint: 76.59,
    angle: 261.11,
    blur: 3.5,
    rotation: 93.47,
    text: ""
}

const args2 = {
    left: 45,
    top: 23,
    size: 9,
    colourMain: "#D0E0ED",
    colourSecondary: "#498AC1",
    startMainPoint: 10.97,
    startSecondaryPoint: 99.56,
    angle: 261.11,
    blur: 3,
    text: ""
}

const args3 = {
    left: 14,
    top: 62,
    leftMobile: 70,
    topMobile: 40,
    size: 9,
    sizeMobile: 40,
    colourMain: "#9B9BE1",
    colourSecondary: "#E8CAFF",
    startMainPoint: -12,
    startSecondaryPoint: 76.59,
    angle: 261.11,
    rotation: -74.2,
    text: ""
}

const args4 = {
    left: 72,
    top: 64,
    leftMobile: 5,
    topMobile: 58,
    sizeMobile: 25,
    size: 16,
    colourMain: "#0069E7",
    colourSecondary: "#BDDBFF",
    startMainPoint: -10.14,
    startSecondaryPoint: 81.0,
    angle: 155.55,
    rotation: 96.49,
    text: "more info"
}

const SphereArgs = [args1, args2, args3, args4];

const CreateSpheres = SphereArgs.map((arg, index) => {
    return (
      <Sphere {...arg}>
        <a href='AboutUs'>
          <PageStyle.MoreInfoText {...arg}>{arg.text}</PageStyle.MoreInfoText>
        </a>
      </Sphere>
    )
})

const AboutUs = () => (
    <div>
        <PageStyle.AboutUsPage>
            <PageStyle.AboutUsContent>
                <PageStyle.AboutUsText>
                    About Us
                </PageStyle.AboutUsText>
                <PageStyle.MainText>
                        We are one of the biggest and most active societies at
                        <PageStyle.BlueText> UNSW</PageStyle.BlueText>
                        , catering to over
                        <PageStyle.BlueText> 3500 CSE students </PageStyle.BlueText>
                        spanning across degrees in Computer Science, Software Engineering, Bioinformatics and Computer Engineering.
                    </PageStyle.MainText>
            </PageStyle.AboutUsContent>
            {CreateSpheres}
        </PageStyle.AboutUsPage>
    </div>
)

export default AboutUs