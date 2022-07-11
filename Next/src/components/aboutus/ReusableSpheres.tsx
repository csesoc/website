import React from 'react';
import { StyledSphere, sphereProps } from './Sphere-Styled';

type Props = sphereProps;

export default function Sphere({ ...styleProps }: Props) {
    return (
        <StyledSphere {...styleProps} />
    );
}
