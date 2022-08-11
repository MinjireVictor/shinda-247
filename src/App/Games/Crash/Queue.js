import React from "react";
import PropTypes from "prop-types";
import md5 from "md5";
import { Table } from "react-bootstrap";
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import socket from "../../../Socket";
import storage from "../../../Storage";
import UserModal from "../../Components/User/Stat/Modal";
import {__, fixDate, Event, wait, decode, encode, forceSatoshiFormat, timeConvertor} from "../../../Helper";
import C from "../../../Constant";
import History from "./History";
import AllBets from "./AllBets";
import Engine from "./Engine";

import Chat from "./../../Pages/Parts/Chat";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={0}>
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    tab: {
        overflowX: 'hidden',
    },
}));


function Queue(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    let { game } = props;
    let token = storage.getKey('token');

    const engine = Engine;

    function load(){
        wait(500).then(() => {
            engine.getPlayers();
        });
    }

    return(
            <div className={classes.root}>
                <AppBar position="static" color="transparent">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs"
                        centered
                    >
                        
                        <Tab onClick={load} icon={<i className={'mdi mdi-chart-bar'} />} label="All Bets" {...a11yProps(0)} />
                        <Tab icon={<i className={'mdi mdi-chart-donut'} />} label="History" {...a11yProps(2)} />
                        <Tab icon={<i className={'mdi mdi-chart-areaspline'} />} label="My Bets" {...a11yProps(1)} />
                        <Tab icon={<i className={'mdi mdi-comment'} />} label="Chat" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={value}
                    onChangeIndex={handleChangeIndex}
                >
                    <TabPanel className={classes.tab} value={value} index={0} dir={theme.direction}>
                        <AllBets t={props.t} game={game} />
                    </TabPanel>
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        <History tab={true} engine={engine} t={props.t} game={game} />
                    </TabPanel>
                    <TabPanel value={value} index={2} dir={theme.direction}>
                        { (token !== null) &&
                            <MyBets engine={engine} t={props.t} game={game} />
                        }
                        { (token === null) &&
                            <div className={'alert alert-success mx-2 mt-2 font-13 text-white text-center'}>You must be logged to see your stats</div>
                        }
                    </TabPanel>
                    <TabPanel value={value} index={3} dir={theme.direction}>
                         <Chat t={props.t} location={props.location} />
                    </TabPanel>
                    
                </SwipeableViews>
            </div>
    );
}

class MyBets extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            loading: true,
            players: [],
            game: 'crash',
            token: storage.getKey('token'),
            name: storage.getKey('name'),
            gameCode: md5('crash')
        };
    }

    componentDidMount(){
        socket.emit(C.MY_BETS, encode({token: this.state.token, game: this.state.game}));
        socket.on(C.MY_BETS, data => this.makeList(decode(data)));
        socket.on(C.ADD_BET, data => this.addList(decode(data)));
    }

    addList(player){
        if(player.name === this.state.name){
            let row = <Players forMy={true} player={player} />;
            this.setState(state => ({ players: [row, ...state.players] }));
        }
    }

    makeList(arr){
        if(typeof arr.history === "undefined") return;
        this.setState({ loading: false });
        arr.history.forEach((player, i) => {
            let row = <Players key={i} forMy={true} player={player} />;
            this.setState(state => ({ players: [row, ...state.players] }));
        });
    }

    render () {
        if(this.state.players.length !== 0)
            this.state.players.length = 10;

        return(
                <>
                    <div className={'table-responsive last-bets num-style mb-0'}>
                        {this.state.loading ?
                        <>
                            <div className="text-center">
                               <div className="spinner-grow text-white my-3" role="status"/>
                            </div>
                        </>
                        :
                        <>
                        <Table className={"mb-0"}>
                            <thead>
                                <tr>
                                    <th>
                                        ID
                                    </th>
                                    <th>
                                        Amount
                                    </th>
                                    <th>
                                        Profit
                                    </th>
                                    <th>
                                        Date/Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.players}
                            </tbody>
                        </Table>
                            {
                                (this.state.players.length === 0) &&
                                    <>
                                        <div className={'alert text-uppercase bg-cs mt-2 font-13 text-white text-center'}>Not Played Yet</div>
                                    </>
                            }
                        </>

                        }
                    </div>
                </>
        );
    }
}

class Players extends React.Component{
    gameDetail = () => {
        Event.emit('single_game_modal', { data: this.props.player })
    }

    render() {
        let {name, amount, profit, coin, created, gid, direct, forMy} = this.props.player;
        let isWinner = false;
        let date = fixDate(created);

        if(direct){
            date = timeConvertor(created);
        }

        if(__.toNumber(profit) !== 0.00)
            isWinner = true;

        return(
            <tr className={'q-crash cpt'}>
                <td onClick={this.gameDetail}>
                    {gid}
                </td>
                {forMy === false &&
                    <td>
                        <UserModal username={name} isWinner={isWinner} />
                    </td>
                }
                <td onClick={this.gameDetail} className={(isWinner===true) ? 'text-success-2 num-style': 'num-style'}>
                    <img src={'/assets/images/' + (coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {forceSatoshiFormat(amount)} {__.upperCase(coin)}
                </td>
                <td onClick={this.gameDetail} className={(isWinner===true) ? 'text-success-2 num-style': 'num-style'}>
                    <img src={'/assets/images/' + (coin) + '.png'} className={'mini-coin-2 hidden-sm'} alt={coin}/>
                    {forceSatoshiFormat(profit)} {__.upperCase(coin)}
                </td>
                <td onClick={this.gameDetail}>
                    {date}
                </td>
            </tr>
        );
    }
}

export default Queue;