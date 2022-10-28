import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Dropdown } from "react-bootstrap";
import coins from "../../../coins";
import { ButtonGroup } from "react-bootstrap";
import User from "../../Parts/User";
import Notifications from "../../Parts/Notification";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import { setCoin, gameCoin, setCredit } from "../../../../actions/gameCoin";
import {
  __,
  wait,
  decode,
  encode,
  forceSatoshiFormat,
} from "../../../../Helper";
import C from "../../../../Constant";
import Coin from "../../../../assets/coin.png";
import Logo from "../../Parts/Logo";
import styled from "styled-components";
import { fetchDummyData } from "../../../../utils/api.utils";
import { Link } from "react-router-dom";

class Credit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      token: storage.getKey("token"),
      coin: "KSH",
      coins: [],
      different: [],
      credits: {},
      credit: false,
      width: window.innerWidth,
    };
    this.selectCoin = this.selectCoin.bind(this);
    this.makeDeposit = this.makeDeposit.bind(this);
    this.openTransactions = this.openTransactions.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    storage.setKey("coin", "kshs");

    //Get Redux Coin
    this.props.gameCoin();
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
    if (this.state.token !== null)
      socket.emit(
        C.CREDIT,
        encode({ token: this.state.token, coin: this.state.coin })
      );

    socket.on(C.CREDIT, (data) => this.getCredit(decode(data)));
    socket.on(C.UPDATE_CREDIT, (data) => this.updateCredit(decode(data)));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    this.setState({ width: window.innerWidth });
  }

  getCredit(data) {
    let { credit } = data;

    this.setState({ credits: credit });

    let currentCoin = __.lowerCase(this.props.coin);
    let currentCredit = this.state.credits[currentCoin];
    this.setState({ credit: currentCredit });
    storage.setKey("credit", currentCredit);

    //Set for Redux
    this.props.setCredit(currentCredit);
  }

  updateCredit(data) {
    let credit = data.value;
    let coin = data.coin;

    let different;
    let arr;

    if (__.toNumber(credit) > __.toNumber(this.state.credit)) {
      different = __.toNumber(credit) - __.toNumber(this.state.credit);
      arr = {
        amount: different,
        color: "text-success",
      };
    } else {
      different = __.toNumber(this.state.credit) - __.toNumber(credit);
      arr = {
        amount: different,
        color: "text-danger",
      };
    }

    let check = forceSatoshiFormat(different);

    if (check.toString() !== "0.00") {
      this.setState((state) => ({ different: [arr, ...state.different] }));
    }

    this.setState({ credit: forceSatoshiFormat(credit) });
    storage.setKey("credit", credit);
    this.updateCoin(__.lowerCase(coin), credit);

    //Set for Redux
    this.props.setCredit(forceSatoshiFormat(credit));
  }

  updateCoin(coin, amount) {
    this.setState({ coins: [] });

    coins.forEach((item, i) => {
      if (__.lowerCase(item.preffix) === coin) {
        let update = (
          <Dropdown.Item
            onClick={() => this.selectCoin(__.upperCase(coin))}
            key={__.toString(i)}
            className={"animated slideInDown num-style"}
          >
            <img
              src={"/assets/images/" + item.image}
              alt="coin"
              className={"mini-coin-2"}
            />
            {item.preffix}: {forceSatoshiFormat(amount)}
          </Dropdown.Item>
        );
        this.setState((state) => ({ coins: [update, ...state.coins] }));
      } else {
        let value = forceSatoshiFormat(
          this.state.credits[__.lowerCase(item.preffix)]
        );
        let update = (
          <Dropdown.Item
            onClick={() => this.selectCoin(item.preffix)}
            key={__.toString(i)}
            className={"animated slideInDown num-style"}
          >
            <img
              src={"/assets/images/" + item.image}
              alt="coin"
              className={"mini-coin-2"}
            />
            {item.preffix}: {value}
          </Dropdown.Item>
        );
        this.setState((state) => ({ coins: [update, ...state.coins] }));
      }
    });
  }

  updateAllCoins() {
    this.setState({ coins: [] });
    coins.forEach((item, i) => {
      let value = forceSatoshiFormat(
        this.state.credits[__.lowerCase(item.preffix)]
      );
      let coin = (
        <Dropdown.Item
          onClick={() => this.selectCoin(item.preffix)}
          key={__.toString(i)}
          className={"animated slideInDown num-style"}
        >
          <img
            src={"/assets/images/" + item.image}
            alt="coin"
            className={"mini-coin-2"}
          />
          {item.preffix}: {value}
        </Dropdown.Item>
      );
      this.setState((state) => ({ coins: [coin, ...state.coins] }));
    });
  }

  selectCoin(name) {
    //Fix For Double selection
    if (storage.getKey("coin") === name) return;
    storage.setKey("coin", name);

    let credit = this.state.credits[__.lowerCase(name)];
    this.setState({ coin: name, credit: credit });

    //Set Coin For Redux
    this.props.setCoin(name);
    this.props.setCredit(credit);
  }

  addDiff(data, i) {
    let id = "id_" + Math.floor(Math.random() * 1000 + 1);

    wait(2000).then(() => {
      this.state.different.splice(i, 1);
      try {
        document.getElementById(id).classList.remove("frd");
        document.getElementById(id).classList.add("fadeOutDown");
      } catch (e) {}
    });

    return (
      <>
        <li
          id={id}
          className={"list-inline w-100 text-right animated frd " + data.color}
        >
          {" "}
          {data.color === "text-danger" ? "-" : "+"}
          {forceSatoshiFormat(data.amount, this.state.coin)}
        </li>
      </>
    );
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
    let { credit } = this.state;
    let { onWalletOpened } = this.props;
    fetchDummyData();

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div className="crypto-balance flex-1 p-1">
          {/* <div className="btc-balance">
            <h5 className="m-0 text-left font-12">Account balance:</h5>
            <span className="text-white d-block font-16">
              {__.upperCase(coin) + " " + credit}
            </span>
          </div> */}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Logo />
            {this.state.width > 500 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <span style={{ color: "#EDA562", fontSize: "1vw" }}>
                  Need Help
                </span>
                <p style={{ color: "white", fontSize: "1.1vw" }}>
                  {" "}
                  Call: 0721234567
                </p>
              </div>
            )}

            {this.state.width > 900 && (
              <TopButtonsComponent backgroundColor="#1F2637">
                <img src={Coin}></img>
                <span style={{ margin: "8px" }}>247 Jackpots</span>
              </TopButtonsComponent>
            )}

            <TopButtonsComponent backgroundColor="#1F2637">
              <img src={Coin}></img>
              <span style={{ margin: "8px" }}>{credit}</span>
            </TopButtonsComponent>
            <TopButtonsComponent
              backgroundColor="#EDA562"
              onClick={() => onWalletOpened("Deposit")}
            >
              <Link to={"/wallet"} style={{ margin: "8px" }}>
                Deposit
              </Link>
            </TopButtonsComponent>

            {this.state.width > 700 && (
              <TopButtonsComponent backgroundColor="#1F2637">
                <img src={Coin}></img>
                <Link to={"/wallet"} style={{ margin: "8px" }}>
                  CASHIER
                </Link>
              </TopButtonsComponent>
            )}

            <ButtonGroup>
              <User t={this.props.t} history={this.props.history} />
              {/* <Notifications t={this.props.t} /> */}
              <i class="bi bi-list"></i>
            </ButtonGroup>
          </div>
        </div>

        <div>
          <div></div>
        </div>
      </div>
    );
  }
}

const TopButtonsComponent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: auto;
  padding: 5px;
  border-radius: 8px;
  color: white;
  background: ${(props) => props.backgroundColor};

  &:hover {
    cursor: pointer;
   
`;

Credit.propTypes = {
  setCoin: PropTypes.func.isRequired,
  coin: PropTypes.string,
};

const mapStateToProps = (state) => ({
  coin: state.items.coin,
});

export default connect(mapStateToProps, { setCoin, gameCoin, setCredit })(
  Credit
);
