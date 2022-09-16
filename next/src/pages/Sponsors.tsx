import React from "react";
import Image from "next/image";
import { content } from "../assets/sponsors.js";

// export const getStaticProps = async () => {
//   return {
//     props: {
//       objectData: content,
//     },
//   }
// }

// export type SponsorTypes = {
//   alt_text: string;
//   amount_paid: number;
//   description: string;
//   expiry_date: string;
//   id: number;
//   in_side_bar: number;
//   level: string;
//   logo: string;
//   name: string;
//   start_date: string;
//   website: string;
// };

export default function Sponsors() {
  return (
    <div>
      <h1>Sponsors</h1>
      <p>
        Principal Sponsors
      </p>
      {content.map((Sponsor) => {
        <div
          key={Sponsor.id}
          style={{
            padding: 20, borderBottom: '1px solid #ccc', color: 'black',
          }}
        >
          {console.log(Sponsor.alt_text)}
          {(Sponsor.alt_text)}
          {/* <Image
            src={`/assets/sponsors/${Sponsor.logo}`}
            width="100px"
            height="100px"
          /> */}
        </div>
      })}
      <p>
        Major Sponsors
      </p>
      <p>
        Affiliiate Sponsors
      </p>
    </div>
  );
}

