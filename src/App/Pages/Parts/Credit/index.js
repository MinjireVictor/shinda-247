import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import socket from "../../../../Socket";
import storage from "../../../../Storage";
import {setCoin, gameCoin, setCredit} from "../../../../actions/gameCoin";
import {__, decode, encode} from "../../../../Helper";
import C from "../../../../Constant";

class Credit extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false,
            token: storage.getKey('token'),
            coin: "KSH",
            credits: {},
            credit: false
        };
        this.makeDeposit = this.makeDeposit.bind(this);
        this.openTransactions = this.openTransactions.bind(this);
    }

    componentDidMount() {
        storage.setKey('coin', 'kshs')
        
        //Get Redux Coin
        this.props.gameCoin();
        if(this.state.token !== null)
            socket.emit(C.CREDIT, encode({ token: this.state.token, coin: this.state.coin }));

        socket.on(C.CREDIT, data => this.getCredit(decode(data)));
    }

    getCredit(data){
        let { credit } = data;
        
        this.setState({credits: credit});

        let currentCoin = __.lowerCase(this.props.coin);
        let currentCredit = this.state.credits[currentCoin];
        this.setState({ credit: currentCredit });
        storage.setKey('credit', currentCredit);
        
        //Set for Redux
        this.props.setCredit(currentCredit);
    }

    makeDeposit() {
        this.props.history.push({
          pathname: '/wallet',
          state: { index: 1 }
        });
    }

    openTransactions() {
        this.props.history.push({
          pathname: '/wallet',
          state: { index: 0 }
        });
    }


    render() {
        let { credit, coin } = this.state;

        return (
            <>
                <div className="crypto-balance flex-1 p-1">
                    <div className="like-row">
                        <div className="btc-balance">
                            <h5 className="m-0 text-left font-12">Account balance:</h5>
                            <span className="text-white d-block font-16">
                                {__.upperCase(coin) + ' ' + credit}
                            </span>
                        </div>
                        <div>
                            <button className="dropdown-toggle btn btn-user mt-0 deposit-btn" onClick={this.makeDeposit}>
                                <i className="fas fa-arrow-down text-drop mr-1 font-13"/> DEPOSIT FUNDS
                            </button>
                        </div>
                        <div>
                            <button className="dropdown-toggle btn btn-user mt-0 py-1-5 trans-btn" onClick={this.openTransactions}>
                                <i className="dripicons-wallet text-drop mr-1 font-13"/> Transactions
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

Credit.propTypes = {
    setCoin: PropTypes.func.isRequired,
    coin: PropTypes.string
};

const mapStateToProps = state => ({
    coin: state.items.coin
});

export default connect(mapStateToProps, { setCoin, gameCoin, setCredit })(Credit);