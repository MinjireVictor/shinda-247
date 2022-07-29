import React, { Component } from 'react'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Modal} from "react-bootstrap";
import {wait, encode, decode} from "../../../../Helper";
import {gameCoin} from "../../../../actions/gameCoin";
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import C from "../../../../Constant";

class BankRoll extends Component{
    constructor(props){
        super(props);
        this.state = {
            show: false,
            amount: 0,
            coin: storage.getKey('coin') ? storage.getKey('coin'): 'Bixea',
            game: this.props.game
        }
    }

    componentDidMount() {
        this.props.gameCoin();

        wait(500).then(() => {
            socket.emit(C.BANKROLL, encode({ game: this.state.game, coin: this.state.coin }));
        });

        socket.on(C.BANKROLL, data => this.setBankRoll(decode(data)));
    }

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }

    setBankRoll = (data) => {
        this.setState({ amount: data });
    };

    help = (e) => {
        this.setState({ show: true, effect: 'zoomIn'});
    }

    close = () => {
        this.setState({ show: false, effect: 'zoomOut'});
    }

    render() {
        let amount = this.state.amount;

        let { style, style2 } = this.props;

        return(
            <>
                {/*<div style={style}>
                    <button className="btn btn-sm bg-cs2 animated fadeInDown" onClick={this.help} style={style2}>
                        {amount} {this.state.coin}
                    </button>
                </div>*/}
                <Modal
                    size="md"
                    centered={true}
                    backdrop={'static'}
                    show={this.state.show}
                    onHide={this.close}
                    aria-labelledby="bankroll-lg-modal"
                    className={"animated " + this.state.effect}
                >
                    <Modal.Header className="Header">
                        <span className="linear-cl">BankRoll</span>
                        <button type="button" className="close p-2" onClick={this.close}>
                            <i className={'mdi mdi-close'}/>
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <p className="font-15 text-white">
                            Bankroll is the pool of money that the bankroller uses to pay out winners of the game.
                        </p>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

BankRoll.propTypes = {
    coin: PropTypes.string
};

const mapStateToProps = state => ({
    coin: state.items.coin
});

export default connect(mapStateToProps, { gameCoin })(BankRoll);