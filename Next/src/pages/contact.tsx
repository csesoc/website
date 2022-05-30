// flex-row
// each icon (wrapper)

import type { NextPage } from "next";
import Head from "next/head";
import Image from 'next/image';
import styled from "styled-components";

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-left: 2rem;
  padding-right: 2rem;
`;

const ImageContainer = styled.div`
  @import url('https://fonts.googleapis.com/css?family=Raleway:300,400,700&display=swap');
  position: absolute;
  font-family: "Raleway", sans-serif;
  text-align: center;
  display: flex;
  padding-left: 2rem;
  padding-right: 2rem;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  display: flex;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-family: "Raleway", sans-serif;
  color: #A09FE3;
  font-size: 64px;
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
  position: fixed;
  bottom: 0;
  text-align: center;
  right: 25%;
  left: 25%;
  width: 50%;
  background: #C1C1C1;
  border-radius: 10px;
  display: inline-block;
`;

const DockLi = styled.li`
  display: inline-block;
  position: relative;
`
const Dock = styled.div`
  margin: 25px;
  display: inline;
`;

const Dot = styled.div`
  display: block;
`;

const Line = styled.div`
  margin: -25px;
  display: inline;
`;
const Support: NextPage = () => {
  return (
    <PageContainer>
      <Head>
        <title>CSESoc</title>
        <meta name="description" content="CSESoc Website Homepage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Title>Resources and Contacts</Title>
        <ImageContainer>
            <File>
                <Image src="/image 13.svg" width={132} height={88}/>
                <Text3>Jobs Board</Text3>

            </File>

            <File>
                <Image src="/image 13.svg" width={132} height={88}/>
                <Text3>Comp Club</Text3>
            </File>

            <File>
                <Image src="/image 13.svg" width={132} height={88}/>
                <Text3>Notangles</Text3>
            </File>

            <File>
                <Image src="/image 13.svg" width={132} height={88}/>
                <Text3>CSElectives</Text3>
            </File>

            <File>
                <Image src="/image 13.svg" width={132} height={88}/>
                <Text3>CSESoc Media</Text3>
            </File>

            <File>
                <Image src="/image 13.svg" width={132} height={88}/>
                <Text3>First Year Guide</Text3>
            </File>

            <File>
                <Image src="/image 13.svg" width={132} height={88}/>
                <Text3>Enrolment Guide</Text3>
            </File>
        </ImageContainer>

        <DockContainer>
            <ul>
                <Dock>
                    <Image src="/Component 12.svg" width={66} height={66}/>
                    
                </Dock>

                <Dock>
                    <Image src="/Component 13.svg" width={66} height={66}/>
                </Dock>

                <Dock>
                    <Image src="/Component 14.svg" width={66} height={66}/>
                </Dock>

                <Dock>
                    <Image src="/Component 15.svg" width={66} height={66}/>
                </Dock>

                <Line>
                    <Image src="/Line 1.svg" width={66} height={66}/>
                </Line>
                <Dock>
                    <Image src="/Component 10.svg" width={66} height={66}/>
                </Dock>

            </ul>
        </DockContainer>
        
      </main>
    </PageContainer>
  );
};

export default Support;