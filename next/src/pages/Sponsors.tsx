import React from "react";
import Image from "next/image";
import { content } from "../assets/sponsors.js";
import defaultCardImage from "../assets/sponsors/ak.webp";

// Fetching data from the JSON file
import fsPromises from 'fs/promises';
import path from 'path'
export const getStaticProps = async () => {
  // const filePath = path.join(process.cwd(), '/root/cse/uni/cms.csesoc.unsw.edu.au/next/src/assets/sponsors.json');
  // const jsonData = await fsPromises.readFile(filePath);
  // const objectData = JSON.parse(jsonData);
  return {
    props: {
      objectData: content,
    },
  }
}

export type SponsorTypes = {
  alt_text: string;
  amount_paid: number;
  description: string;
  expiry_date: string;
  id: number;
  in_side_bar: number;
  level: string;
  logo: string;
  name: string;
  start_date: string;
  website: string;
};

export default function Sponsors(objectData: Array<SponsorTypes>) {
  return (
    <div>
      <h1>Sponsors</h1>
      <p>
        Principal Sponsors
      </p>
      <div>
      {
      
          <div
            key={content.id}
            style={{
              padding: 20, borderBottom: '1px solid #ccc'
            }}
          >
            {/* <Image
              src={`../assets/sponsors/"${objectData.logo}"`}
              layout="fill"
              objectFit="contain"
            /> */}
            {/* <Image
                src={`/assets/sponsors/${+ content.logo}}`}
                layout="fill"
                objectFit="contain"
              /> */}
            {
          content.map((Sponsor) =>
            <div
              key={Sponsor.id}
              style={{
                padding: 20, borderBottom: '1px solid #ccc'
              }}
            >
              {Sponsor.alt_text}
              <Image
                src={`/assets/sponsors/${Sponsor.logo}`}
                width="100px"
                height="100px"
              />
              
            </div>
          )}
          </div>
      
        }
      </div>
      <p>
        Major Sponsors
      </p>
      <p>
        Affiliiate Sponsors
      </p>
    </div>
  );
}

