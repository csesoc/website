import type { NextPage } from "next";
import Image from 'next/image';
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 2rem;
  margin: 5rem;
  justify-content: space-evenly;
`;

const ImageContainer = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Raleway:300,400,700&display=swap');
  position: absolute;
  font-family: "Raleway", sans-serif;
  text-align: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 75vw;
  padding-left: 5rem;
  padding-right: 5rem;
`;

const Title = styled.h1`
  font-family: "Raleway", sans-serif;
  color: #A09FE3;
  font-size: 5rem;
  text-align: center;
`

const Text3 = styled.body`
  color: black;
  font-size: 12px;
  font-weight: bold;
`;

const File = styled.div`
  margin: 30px;
  margin-bottom: 50px;
`;

const DockContainer = styled.div`
  background: #C1C1C1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  height: 6rem;
  position: relative;
  margin-top: 5rem;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
`;

const Dock = styled.div`
  margin: 25px;
  display: inline;
`;

const Line = styled.div`
  margin: -25px;
  display: inline;
`;
const Contact: NextPage = () => {
  return (
    <PageContainer>
        <ImageContainer>
            <Title>Resources and Contacts</Title>
            <File>
                <Image src="/assets/File.svg" width={132} height={88}/>
                <Text3>Jobs Board</Text3>
            </File>

            <File>
                <Image src="/assets/File.svg" width={132} height={88}/>
                <Text3>Comp Club</Text3>
            </File>

            <File>
                <Image src="/assets/File.svg" width={132} height={88}/>
                <Text3>Notangles</Text3>
            </File>

            <File>
                <Image src="/assets/File.svg" width={132} height={88}/>
                <Text3>CSElectives</Text3>
            </File>

            <File>
                <Image src="/assets/File.svg" width={132} height={88}/>
                <Text3>CSESoc Media</Text3>
            </File>

            <File>
                <Image src="/assets/File.svg" width={132} height={88}/>
                <Text3>First Year Guide</Text3>
            </File>

            <File>
                <Image src="/assets/File.svg" width={132} height={88}/>
                <Text3>Enrolment Guide</Text3>
            </File>

            <DockContainer>
              <ul>
                <Dock>
                    <Image src="/assets/Spotify.svg" width={66} height={66}/>
                    
                </Dock>

                <Dock>
                    <Image src="/assets/Discord.svg" width={66} height={66}/>
                </Dock>

                <Dock>
                    <Image src="/assets/Facebook.svg" width={66} height={66}/>
                </Dock>

                <Dock>
                    <Image src="/assets/Youtube.svg" width={66} height={66}/>
                </Dock>

                <Line>
                    <Image src="/assets/Line 1.svg" width={66} height={66}/>
                </Line>
                <Dock>
                    <Image src="/assets/GreyArrow.svg" width={66} height={66}/>
                </Dock>

              </ul>
            </DockContainer>  
        </ImageContainer>      
    </PageContainer>
  );
};

export default Contact;