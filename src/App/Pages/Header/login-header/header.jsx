import Logo from "../../Parts/Logo";
import React from "react";
import { LoginButton, LoginContainer, RegisterButton } from "./header.styles";
import { useDispatch } from "react-redux";
import { onLoginClicked } from "../../../../actions/login.action";
import "reactjs-popup/dist/index.css";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const NewHeader = ({ t, mobile }) => {
  const dispatch = useDispatch();

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, [width]);

  const handleOnClick = (event) => {
    dispatch(onLoginClicked());
  };

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* {
                clicked&& <Login t={t} mobile={mobile} />
            } */}
      <Logo />
      <div
        style={{
          marginLeft: "2rem",
        }}
      ></div>
      <HelpHeader width={width}>
        <span style={{ color: "#EDA562", fontSize: "1.1vw" }}>Need Help</span>
        <span style={{ color: "white", fontSize: "1.3vw" }}>
          {" "}
          Call: 0721234567
        </span>
      </HelpHeader>
      <WinnersHeader width={width}>
        <span
          style={{ color: "#EDA562", fontSize: "1.3vw", marginRight: "8px" }}
        >
          Winners:{" "}
        </span>
        <span style={{ color: "white", fontSize: "1.3vw", marginRight: "8px" }}>
          {" "}
          Charles 254 - Ksh.38,478
        </span>
      </WinnersHeader>
      <LoginContainer>
        <LoginButton onClick={handleOnClick}>
          <span>LOGIN</span>
        </LoginButton>
        <RegisterButton>
          <span>
            <Link to={"/register"}>REGISTER</Link>
          </span>
        </RegisterButton>
      </LoginContainer>
    </div>
  );
};

const HelpHeader = styled.div`
  display: ${(props) => (props.width < 900 ? `none` : `flex`)};
  flex-direction: column;
  justify-content: center;
  height: 100%;
  min-height: 100%;
  align-items: center;
`;

const WinnersHeader = styled.div`
  display: ${(props) => (props.width < 700 ? `none` : `flex`)};
  flexdirection: row;
  alignitems: center;
  justifycontent: center;
`;

export default NewHeader;
