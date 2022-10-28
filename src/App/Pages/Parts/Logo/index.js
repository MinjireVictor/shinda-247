import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "../../../../Helper";

class Logo extends React.Component {
  render() {
    return (
      <>
        <div className="topbar-left">
          <Link to="/" className="logo">
            <span>
              <img
                src="/assets/images/logo.png"
                className="logo-sm"
                alt="Logo"
                style={{ minWidth: "120px", height: "auto", width: "100%" }}
              />
            </span>
          </Link>
        </div>
      </>
    );
  }
}

export default Logo;
