import React, { Component } from "react";
import storage from "../../../../Storage";
import { Helmet } from "react-helmet";
import Wallet from "./Wallet";
import { Link } from "react-router-dom";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: storage.getKey("token"),
    };
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { token } = this.state;
    const { route } = this.props;

    return (
      <>
        <Helmet>
          <title>User Wallet - Original Crash Game</title>
        </Helmet>
        <div className={"card p-2 mb-2"}>
          <div className="m-auto text-center">
            <h2 className={"text-center mb-2 pb-1 hdr flex"}>
              <Link to={"/"} className="cpt hvw" title="go back">
                <i className="fa fa-chevron-left font-20 aligdsn-top ml-3 mr-2 mt-1" />
              </Link>
              <span className="flex-1">
                <span className="linear-cl">User Wallet</span>
              </span>
            </h2>
            <div className="text-left card-auto">
              {token ? (
                <Wallet route={route} />
              ) : (
                <div className={"alert alert-warning text-white m-2"}>
                  <span>Please Login first to use this option.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Main;
