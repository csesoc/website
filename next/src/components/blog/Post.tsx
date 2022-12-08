import Image, { StaticImageData } from 'next/image'
import styled from 'styled-components'
import {useState, useEffect} from 'react';
import analyze from "@ramielcreations/rgbaster"
import rgbaToRgb from 'rgba-to-rgb'

interface PostProps {
    size: "full" | "l" | "m" | "s",
    img: StaticImageData,
    topic: string,
    title: string,
    paragraph: string,
}

const PostWrapper = styled.div<{postSize : string, colour: string}>`
    display: flex;
    flex-direction: ${props => props.postSize === "full" ? "row" : "column"};
    width: ${({postSize}) => handleSize(postSize)};
    background-color: ${props => props.colour};
    padding: 2em;
    border-radius: 0.5em;
    margin: 0 3em;
`

const handleSize = (size : string) => {
    switch (size) {
        case "full":
            return "100%";
        case "l":
            return "75%";
        case "m":
            return "50%";
        case "s":
            return "33%";
    }
}

const ImageWrapper = styled.div`
    overflow: hidden;
    border-radius: 0.5em;
`

const TextWrapper = styled.div<{size : string}>`
    margin-left: ${props => props.size === "full" ? "3rem" : ""};
`

const Topic = styled.p`
    color: #5C8698;
    text-transform: uppercase;
    margin-bottom: 0;
    font-size: 1em;
`

const Title = styled.h1`
    margin-top: 0;
    font-size: 1.8em;
`

const Paragraph = styled.p`
    font-size: 1em;
`

const imageProcess = async (pic : StaticImageData) => {
    const result = await analyze(pic.src, { scale: 0.5}) // also supports base64 encoded image strings
    let new_col = result[0].color.toString().replace(/rgb/i, "rgba");
    new_col = new_col.replace(/\)/i,',0.3)');
    return rgbaToRgb('rgb(255, 255, 255)', new_col);
}

const Post = ({size, img, topic, title, paragraph}: PostProps) => {
    const [useColour, setColour] = useState("rgb(255,255,255)");
    useEffect(() => {
        const fetchData = async () => {
          const data = await imageProcess(img);
          setColour(data.toString());
        }
        fetchData();
      }, []);

    return (
        <PostWrapper postSize={size} colour={useColour}>
            <ImageWrapper><Image src={img} draggable="false"/></ImageWrapper>
            <TextWrapper size={size}>
                <Topic>{topic}</Topic>
                <Title>{title}</Title>
                <Paragraph>{paragraph}</Paragraph>
            </TextWrapper>
        </PostWrapper>
    )
}

export default Post;