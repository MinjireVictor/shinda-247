import React from 'react'
import PropTypes from "prop-types";
import {connect} from "react-redux";
import * as Cookies from "js-cookie";
//import UserHeader from './Parts/Header/Header-User';
//import GuestHeader from './Parts/Header/Header-Guest';
import Chat from "./Parts/Chat";
//import Register from "./Auth/Register";
import Sidebar from './Parts/Sidebar';
import Footer from './Parts/Footer';
import socket from "../../Socket";
import {Event, decode, encode, wait} from "../../Helper";
import WalletAlert from "../../App/Components/User/Wallet/Alert";
import C from "../../Constant";
import UserWrapper from "./Auth/UserWrapper";
import AllBets from "../Games/Crash/AllBets";
import storage from "../../Storage";

class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn: false,
            auth: false
        }
    }

    componentDidMount(){
        socket.on(C.ONLINE, (status) => this.loginUser(decode(status)));
        Event.on('showAuthModal', (status) => this.activeAuth(status));

        /**
         * Initialize Authentication
         */
        const sessionCookie = Cookies.get("auth");

        if(storage.getKey('token') !== null && sessionCookie)
        {
            socket.emit(C.ONLINE, encode({
                jwt_token: storage.getKey('jwt_token'), //fake
                user_token: storage.getKey('user_token'), //fake
                security_key: storage.getKey('security_key'), //fake
                secret_user: storage.getKey('secret_user'), //fake
                secret_realtime: storage.getKey('secret_realtime'), //fake
                client_system: storage.getKey('client_system'), //fake
                token_key: storage.getKey('token_key'), //fake
                secret_token: storage.getKey('secret_token'), //fake
                token: storage.getKey('token'), // REAL
            }));
        }
    }

    activeAuth = (status) => {
        this.setState({ auth: status });
    }

    loginUser = (data) => {
        wait(500).then(() => {
            if(data.status === true)
            {
                this.setState({ isLoggedIn: true });
                Cookies.set("uid", data.id, {expires: 14});
                Cookies.set("auth", true, {expires: 14});
                storage.setKey('userid', data.id);
                storage.setKey('name', data.name);
                storage.setKey('email', data.email);
                storage.setKey('credit', data.credit);
                storage.setKey('avatar', data.avatar);
                storage.setKey('friends', data.friends);
                storage.setKey('room', data.room);
            }
            else {
                wait(7000).then(() => {
                    localStorage.clear();
                })
            }
        })
    }

    render() {
        let { t, content } = this.props; // Pages / Games Contents
        let wallet; // Show Wallet if User don't Have Cash
        const { isLoggedIn } = this.state;

        try {
            wallet = this.props.get_wallet.show;
        }
        catch (e) {}
        return(
            <>
                {/*--header--*/}
                <div className="page-wrapper fill ova">
                    <Sidebar t={t} />
                    <div className="page-content ova flex-column" id={'page-content'}>
                        <div className="flex-1">
                            {wallet &&
                                <WalletAlert t={t} uid={this.props.get_wallet.uid} />
                            }
                            <div className="content-top p-1 sm">
                                <div className="card mb-2">
                                    <div className="card-body p-1">
                                        <UserWrapper t={t} isLoggedIn={isLoggedIn} mobile={true} />
                                    </div>
                                </div>
                            </div>
                            <div className="content-wrap">
                                <div className="content-left flex-1 p-1">
                                    {content}
                                </div>
                                <div className="content-right flex-column rev p-1">
                                    <div className="right-top lg">
                                        <div className="card mb-2">
                                            <div className="card-body p-1">
                                                <UserWrapper t={t} isLoggedIn={isLoggedIn} mobile={false} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="flex-1">
                                        <div className="card mb-2">
                                            <div className="card-body p-1">
                                                <h5 className="mr-1 ml-1">PLAYERS</h5>
                                                <div className="table-responsive last-bets cq num-style mb-1">
                                                    <AllBets t={t} />
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <Chat t={t} location={this.props.location} />
                                </div>
                            </div>
                        </div>
                        <Footer t={t} />
                    </div>
                </div>
            </>
        );
    }
}

Index.propTypes = {
    get_wallet: PropTypes.string
};

const mapStateToProps = state => ({
    get_wallet: state.items.get_wallet
});

export default connect(mapStateToProps, null)(Index);