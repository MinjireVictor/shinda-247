import React from "react";
import { Dropdown } from "react-bootstrap";
//import Wallet from "../../../Components/User/Wallet";
import Setting from "../../../Components/User/Setting";
import UserModal from "../../../Components/User/Stat/Modal";
import storage from "../../../../Storage";
import { defaultAvatar } from "../../../../Helper";
import PrivateMessage from "./../PrivateMessage";
import Logout from "./../../Auth/Logout";
import { Link } from "react-router-dom";
class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 1,
      name: storage.getKey("name"),
      //            avatar: storage.getKey('avatar') !== 'false' ? storage.getKey('avatar'): defaultAvatar,
      avatar: defaultAvatar.slice(0, -3) + "svg",
    };
    this.callWallet = this.callWallet.bind(this);
    this.makeDeposit = this.makeDeposit.bind(this);
    this.openTransactions = this.openTransactions.bind(this);
  }

  callWallet() {
    this.props.history.push({
      pathname: "/wallet",
      state: { index: 0 },
    });
  }
  makeDeposit() {
    this.props.history.push({
      pathname: "/wallet",
      state: { index: 1 },
    });
  }

  openTransactions() {
    this.props.history.push({
      pathname: "/wallet",
      state: { index: 0 },
    });
  }

  render() {
    const { t } = this.props;
    return (
      <li className={"user-dropdown"}>
        <Dropdown left="true">
          <Dropdown.Toggle
            split
            variant="b btn-xs mt-0"
            id="dropdown-split-user"
          >
            <img
              src={this.state.avatar}
              alt="profile-user"
              className="thumb-sm rounded-circle"
            />
            <span className="ml-1 nav-user-name hidden-sm">
              <span className="bi bi-list"></span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className={"droper user-dropdown-detail"}>
            <UserInfo
              level={this.state.level}
              name={this.state.name}
              avatar={this.state.avatar}
              t={t}
            />
            <div className="dropdown-divider" />
            <div className="user-links">
              <Dropdown.Item as={"button"} className={"animated fadeIn"}>
                {/* Change it into a link */}
                {/* <span onClick={this.callWallet} className={"dropdown-item"}>
                  <i className="dripicons-wallet text-muted mr-2 text-drop" />
                  Wallet
                </span> */}
                <Link to={"/wallet"} className={"dropdown-item"}>
                  <i className="dripicons-wallet text-muted mr-2 text-drop" />
                  Wallet
                </Link>
              </Dropdown.Item>
              <Dropdown.Item as={"button"} className={"animated fadeIn"}>
                <Link to={"/wallet"} className={"dropdown-item"}>
                  <i className="dripicons-wallet text-muted mr-2 text-drop" />
                  Transactions
                </Link>
              </Dropdown.Item>
              <Dropdown.Item as={"button"} className={"animated fadeIn"}>
                <Link to={"/wallet"} className={"dropdown-item"}>
                  <i className="dripicons-wallet text-muted mr-2 text-drop" />
                  Deposit
                </Link>
              </Dropdown.Item>
              <Dropdown.Item as={"button"} className={"animated fadeIn"}>
                <PrivateMessage desktop={true} t={t} />
              </Dropdown.Item>
              <Dropdown.Item as={"button"} className={"animated fadeIn"}>
                <Setting t={t} />
              </Dropdown.Item>
              <Dropdown.Item as={"button"} className={"animated fadeIn"}>
                <Logout t={t} />
              </Dropdown.Item>
            </div>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  }
}

class UserInfo extends React.Component {
  makeStars = (num) => {
    let stars = 5;
    let userLevel = stars - parseFloat(num);
    var g = [],
      o = [],
      f = [];
    for (var i = 0; i < userLevel; i++) {
      g.push(<i key={i} className={"mdi mdi-star font-15"} />);
    }
    for (var j = 0; j < num; j++) {
      o.push(<i key={j} className={"mdi mdi-star text-success font-20"} />);
    }
    f.push(o, g);
    return f;
  };
  render() {
    const { name, level, avatar, t } = this.props;
    return (
      <>
        <div className="user-bar">
          {<UserModal t={t} username={name} menu={true} avatar={avatar} />}
          <span className="text-white">{name}</span>
          <br />
          <span>{this.makeStars(level)}</span>
        </div>
      </>
    );
  }
}

export default User;
