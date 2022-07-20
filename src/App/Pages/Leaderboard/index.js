import React from 'react'
import {Helmet} from 'react-helmet'
import { Table } from "react-bootstrap";
import socket from "../../../Socket";
import { wait, __, defaultAvatar} from "../../../Helper";
import C from "../../../Constant";
import UserModal from "../../Components/User/Stat/Modal";

class Leaderboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            players: []
        }
    }

    componentDidMount() {
        socket.emit(C.TOP_WINNERS);
        socket.on(C.TOP_WINNERS, data => this.makeList(data));
    }

    componentWillUnmount() {
        this.setState = (state,callback)=>{
            return;
        };
    }

    makeList = (data) => {
        wait(500).then(() => {
            this.setState({ loading: false, players: data });
        })
    };

    render(){
        const { t } = this.props;

        const list = this.state.players.map((player, i) =>
            <Players key={i} medal={i+1} player={player} />
        );

        return(
                <>
                <Helmet>
                    <title>Leaderboard - Original Crash Game</title>
                </Helmet>
                <div className={'table-responsive last-bets num-style mb-0'}>
                    {
                        this.state.loading ?
                            <div className="text-center">
                                <div className="spinner-grow text-white my-3" role="status"/>
                            </div>
                        :
                        <Table className={"game-table mb-2"}>
                            <thead>
                            <tr>
                                <th></th>
                                <th>{t('username')}</th>
                                <th>{t('wagered')}</th>
                                <th>{t('prize')}</th>
                                <th>{t('medal')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {list}
                            </tbody>
                    </Table>
                    }
                </div>
                </>
        );
    }
}

class Players extends React.Component{
    render() {
        let { player, medal } = this.props;
        let num = medal;
        
        if(medal === 10){
            medal = 1
        }

        let coin = "kshs"
        let username = player.name;
        let avatar = player.avatar || defaultAvatar;
        let wagered = player.profit_high[coin];
        let prize = wagered / 2;

        return(
            <tr className={'q-crash'}>
                <td>
                    {num}
                </td>
                <td>
                   
                    <UserModal username={username} isWinner={false} />
                </td>
                <td className={'num-style text-white'}>
                    {wagered} {(__.upperCase(coin))}
                </td>
                <td className={'num-style text-success'}>
                    {prize} {(__.upperCase(coin))}
                </td>
                <td>
                    <img className="rounded-circle thumb-xs ffi" src={'/assets/images/badges/badge-' + medal + '.svg'} alt="" />
                </td>
            </tr>
        );
    }
}

export default Leaderboard;