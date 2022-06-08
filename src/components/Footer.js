import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <FooterWrap>
      <p>&copy; {new Date().getFullYear()} 💩 Hyejun.</p>
    </FooterWrap>
  );
};

const FooterWrap = styled.footer`
  border-top: solid lightgray 1px;
  padding: 10px;
  margin-top: 1em;
`;

export default Footer;
