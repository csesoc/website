import React, { useState } from "react";
import * as PageStyle from '../components/sponsors/Sponsors-Styled';
import { content } from "../assets/sponsors.js";
import Image from "next/image";
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';
import Footer from "../components/footer/Footer";

export default function Sponsors() {
  const [open, setOpen] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorDescription, setSponsorDescription] = useState("");
  const handleClose = () => setOpen(false);

  function SponsorContainers(tierName: string, tierLevel: string, size: string) {
    let tier = content.filter(S => S.level === tierLevel);
    return (
      <div>
        <PageStyle.SponsorsTier>
          {tierName}
        </PageStyle.SponsorsTier>
        <PageStyle.LevelContainer>
          {tier.map((Sponsor) =>
            <PageStyle.SponsorsLogo>
              <Image
                src={`/assets/sponsors/${Sponsor.logo}`}
                width={size}
                height={size}
                objectFit="contain"
                onClick={() => {
                  setOpen(true);
                  setSponsorName(Sponsor.alt_text);
                  setSponsorDescription(Sponsor.description);
                }}
              />
            </PageStyle.SponsorsLogo>)}
        </PageStyle.LevelContainer>
      </div>
    );
  }

  // Function for the modal popup that contains descriptions for each sponsor
  function SponsorDetails() {
    return (
      <PageStyle.SponsorsModal>
        <PageStyle.SponsorsTitle>
          {sponsorName}
        </PageStyle.SponsorsTitle>
        <PageStyle.SponsorsInfo dangerouslySetInnerHTML={{ __html: sponsorDescription }} />
      </PageStyle.SponsorsModal>
    );
  }

  return (
    <div>
      <PageStyle.SponsorsContainer>
        <PageStyle.SponsorsHeading>Sponsors</PageStyle.SponsorsHeading>
        {SponsorContainers('Principal Sponsors', 'P', '250px')}
        {SponsorContainers('Major Sponsors', 'M', '200px')}
        {SponsorContainers('Affiliiate Sponsors', 'A', '150px')}
      </PageStyle.SponsorsContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        PaperProps={{
          style: {
            backgroundColor: 'transparent',
            boxShadow: '0px 0px 100px 8px rgba(0, 0, 0, .3)',
            borderRadius: 5,
          },
        }}
      >
        <Fade in={open}>
          <div>
            <SponsorDetails />
          </div>
        </Fade>
      </Dialog>
      <Footer />
    </div>
  );
}