import styled from "styled-components";
import { Link } from "react-router-dom";

export const LoginButton = styled.div`
  background-color: #222e4e;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  min-width: 100px;
  width: auto;
  margin: 10px;
  color: white;

  &:hover {
    cursor: pointer;
    background-color: #141b2e;
  }
`;

export const RegisterButton = styled(Link)`
  background-color: #eda562;
  height: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  min-width: 100px;
  width: auto;
  margin: 10px;
  color: white;

  &:hover {
    cursor: pointer;
  }
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-direction: center;
`;

export const HelpHeader = styled.div`
  display: ${(props) => (props.width < 900 ? `none` : `flex`)};
  flex-direction: row;

  height: 100%;
  min-height: 100%;
  align-items: center;
`;

export const WinnersHeader = styled.div`
  display: ${(props) => (props.width < 700 ? `none` : `flex`)};
  flexdirection: row;
  alignitems: center;
  width: auto;
  height: auto;
  background-color: red;
`;
