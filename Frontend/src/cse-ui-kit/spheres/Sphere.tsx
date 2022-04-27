import React from 'react';
import { StyledSphere, sphereProps } from './Sphere-Styled';


type Props = {
    children?: React.ReactElement | any;
    onClick?: (...args: any) => void;
} & sphereProps;

export default function Sphere({ ...styleProps }: Props) {
    return (
        <StyledSphere
            {...styleProps}
        >
        </StyledSphere>
    );
}
