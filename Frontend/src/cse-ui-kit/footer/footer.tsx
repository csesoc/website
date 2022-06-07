import React from 'react';
import { StyledFooter, FooterProps} from './footer-Styled';

type Props = {
    children?: React.ReactElement | any;
    className?: string;
  } & FooterProps;

export default function Footer({ children, className}: Props) {
    return (
        <StyledFooter className={className}>
          {children}
        </StyledFooter>    
    );
  }

