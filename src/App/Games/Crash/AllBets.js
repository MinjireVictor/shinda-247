import React from "react";
import { Table } from "react-bootstrap";
import storage from "../../../Storage";
import UserModal from "../../Components/User/Stat/Modal";
import {__, isMobile} from "../../../Helper";
import Engine from "./Engine";

class AllBets extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            players: [],
            winners: [],
            failed:  [],
            isWinner: false,
            engine: Engine
        };
    }

    onChange(event, players, winner) {
        this.setState({ players: players, isWinner: winner } )
    }

    onWinner(event, winners) {
        this.setState({ winners: winners } )
    }

    render () {
        const { players, winners } = this.state;
        return <Child engine={this.state.engine} onChange={this.onChange.bind(this, players)} onWinner={this.onWinner.bind(this, winners)} />
    }
}

class Child extends React.Component {
    _isMounted = false;
    constructor (props) {
        super(props);
        this.state = {
            playersObject: [],
            winnersObject: []
        };
    }

    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            let { engine } = this.props;

            engine.trigger.on("finish_crash", data => this.syncFinishPlayer(data));
            engine.trigger.on("play_crash", data => this.syncPlayPlayer(data));
            engine.trigger.on("busted_crash", data => this.busted(data));
            engine.trigger.on("waiting_crash", data => this.isWaiting(data));
            engine.trigger.on("game_status", data => this.gameSync(data));
            engine.trigger.on("game_players", data => this.gameSync(data));
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    syncPlayPlayer(data){
        if (this._isMounted) {
            let add = this.state.playersObject.concat(data);
            this.setState({ playersObject: add });
            this.props.onChange(this.state.playersObject)
        }
    }

    syncFinishPlayer(data){
        if (this._isMounted) {
            let index = __.findIndex(this.state.playersObject, function(o) { return o.uid === data.uid; });
            this.state.playersObject.splice(index, 1);
            let add = this.state.winnersObject.concat(data);
            this.setState({ winnersObject: add });
            this.props.onWinner(this.state.winnersObject)
        }
    }

    gameSync(data){
        if (this._isMounted) {
            sortByAmount(data.players).forEach((item, i) => {
                this.state.playersObject.push(item);
            });
            this.props.onChange(this.state.playersObject);

            sortByCashout(data.winners).forEach((item, i) => {
                this.state.winnersObject.push(item);
            });
            this.props.onWinner(this.state.winnersObject, true);
        }
    }

    busted(data){
        if (this._isMounted) {
            this.setState({ playersObject: [], winnersObject: []} );
            this.state.playersObject.shift();
            this.state.winnersObject.shift();

            sortByAmount(data.players).forEach((item, i) => {
                this.state.playersObject.push(item);
            });

            this.props.onChange(this.state.playersObject);

            sortByCashout(data.winners).forEach((item, i) => {
                this.state.winnersObject.push(item);
            });

            this.props.onWinner(this.state.winnersObject,true);
        }
    }

    isWaiting(data){
        if (this._isMounted) {
            this.setState({playersObject: [], winnersObject: []});

            sortByAmount(data.players).forEach((item, i) => {
                this.state.playersObject.push(item);
            });
            this.props.onChange(this.state.playersObject);
        }
    }

    render () {
        return(
            <ShowUserTable
                engine={this.props.engine}
                players={this.state.playersObject}
                winners={this.state.winnersObject}
            />
        )
    }
}

class UsersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if(isMobile()){
            this.setState({ font: 'font-10' })
        }
    }

    render() {
        let playerRows = [];
        let winnerRows = [];
        let checkExists = [];

        if(this.props.players.length > 0) {
            this.props.players.forEach((currentPlayer, i) => {
                if(!checkExists.includes(currentPlayer.name)){
                    checkExists.push(currentPlayer.name);
                    if(currentPlayer.session === 'crash')
                        playerRows.push(<UserRow engine={this.props.engine} currentPlayer={currentPlayer} key={i} isWinner={false} isFailed={false}/>);
                }
            });
        }

        if(this.props.winners.length > 0){
            this.props.winners.forEach((currentPlayer, i) => {
                if(!checkExists.includes(currentPlayer.name)) {
                    checkExists.push(currentPlayer.name);
                    if(currentPlayer.session === 'crash')
                        winnerRows.push(<UserRow engine={this.props.engine} currentPlayer={currentPlayer} key={i} isWinner={true} isFailed={false}/>);
                }
            });
        }

        return (
            <>
                <div className={'table-responsive last-bets cq num-style mb-0'}>
                    <Table className={"game-table mb-0 " + this.state.font}>
                        <thead><tr><th>PLAYER</th><th>PAYOUT</th><th className="text-left">BET</th><th className="text-left">PROFIT</th></tr></thead>
                        <tbody>
                        {playerRows}
                        {winnerRows}
                        </tbody>
                    </Table>
                </div>
            </>
        );
    }
}

class ShowUserTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        var size = 50;
        var players = sortByAmount(this.props.players);
        var winners = sortByCashout(this.props.winners);
        players.length = Math.min(players.length, size);
        winners.length = Math.min(winners.length, size);
        return (
            <UsersTable
                engine={this.props.engine}
                players={players}
                winners={winners}
            />
        );
    }
}


class UserRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render(){
        if(this.props.currentPlayer.uid === undefined || this.props.currentPlayer.name === undefined)
            return null;

        let profit = (this.props.currentPlayer.won) ? this.props.currentPlayer.won : '-';

        let self = '', type = 'white text-warning', cashout = '-';

        let bet = this.props.currentPlayer.amount;

        if(this.props.currentPlayer.token === storage.getKey('token'))
            self = 'bg-soft-warning';

        if(this.props.engine.gameStatus === 'busted')
        {
            if(profit === '-')
                type = 'text-danger';
        }

        if(profit !== '-'){
            type = 'text-success';
            cashout = (this.props.currentPlayer.current/100).toFixed(2) +  'x';
        }

        return (
            <tr key={this.props.currentPlayer.uid} className={type + ' ' + self + ' q-crash text-center'}>
                <td className="text-left">
                    <UserModal username={this.props.currentPlayer.name} queue={true}  isWinner={profit} />
                </td>
                <td className="text-left" size="20"> {cashout}</td>
                <td className="text-left num-style">
                    {bet} <span className={'hidden-sm'}>{__.upperCase(this.props.currentPlayer.coin)}</span> </td>
                <td className="text-left num-style">
                    {profit} <span className={'hidden-sm'}>{__.upperCase(this.props.currentPlayer.coin)}</span>
                </td>
            </tr>
        )
    }
}


function sortByAmount(input) {
    function r(c) {
        return c.amount ? - c.amount : null;
    }
    return __.sortBy(input, r);
}

function sortByCashout(input) {
    function r(c) {
        return c.current ? - c.current : null;
    }
    return __.sortBy(input, r);
}

export default AllBets;
