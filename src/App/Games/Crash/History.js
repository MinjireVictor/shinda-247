import React from 'react'
import {Table} from "react-bootstrap";
import GameModal from "../../Components/Game/Stat/Modal";
import {__, isMobile, wait, Event} from "../../../Helper";
import C from "../../../Constant";
import storage from "../../../Storage";
import Engine from "./Engine";

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameRow: [],
            show: false
        };
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleShow(){
        this.setState({ show: true, effect: 'zoomIn' });
    }

    handleClose(){
        this.setState({ show: false, effect: 'zoomOut' });
    }

    render() {
        return <Parent tab={true} clicked={this.handleClose} />;
    }
}

class Parent extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            players: [],
            game_id: '',
            numbers: '',
            hash: '',
            md5: ''
        };
    }

    onChange(event, players, hash, md5, game_id, numbers) {
        this.setState({
            md5: md5,
            hash: hash,
            numbers: numbers,
            game_id: game_id,
            players: players,
            color: (numbers >= 1.9 ? 'success' : 'danger')
        });
    }

    render () {
        const { players, hash, md5, game_id, busted } = this.state;
        return <Child tab={this.props.tab} clicked={this.props.clicked.bind(this)} onChange={this.onChange.bind(this, players, hash, md5, game_id, busted)} />
    }
}

class Child extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            engine: Engine,
            loading: true,
            padding: 'p-2',
            token: storage.getKey('token') !== null ? storage.getKey('token') : null,
            historyRow: [],
            players: [],
            posts: [],
            postsLength: 0,
            current_page: 1,
            page: 1,
            perPage: 10,
            ndisabled: false,
            pdisabled: false
        };

        this.prevRef = React.createRef();
        this.nextRef = React.createRef();
    }

    componentDidMount(){
        this._isMounted = true;
        let { engine } = this.state;
        engine.getHistory();
        engine.trigger.on(C.HISTORY_CRASH, (data) => this.gameSync(data));
        engine.trigger.on("busted_crash", (data) => this.busted(data));

        if(isMobile()){
            this.setState({ padding: 'p-1' })
        }
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    gameSync(list){
        if (this._isMounted) {

            wait(1000).then(() => {
                this.setState({ loading: false });
            })
    
            let data = list.history;
                data = __.xor(data);

            const mapDate = this.getDateTime;
            data.forEach(function(row) {
                row.date = mapDate(row.date);
            });

            this.setState({ posts: data });
            this.setState({ postsLength: data.length });

            this.changePage(1);
        }
    }

    getDateTime(str) {
        const currentdate = str ? new Date(Date.parse(str)) : new Date();
        const datetime = currentdate.getFullYear() + "-"
                        + (currentdate.getMonth()+1)  + "-"
                        + currentdate.getDate() + " "
                        + currentdate.getHours() + ":"
                        + currentdate.getMinutes();
        return datetime;
    }

    busted(data) {
        if (this._isMounted) {
//            console.log(data);
            const busted  = (data.amount/100).toFixed(2);
            const datetime = this.getDateTime();

            const post = {gid: __.toNumber(data.game_id), busted: busted, hash: data.hash, date: datetime};

            let posts = this.state.posts;
            posts.pop();
            posts.unshift(post);
            this.setState({ posts: posts });
            this.setState({ postsLength: posts.length });
            this.changePage(this.state.page);
        }
    }

    numPages = () => {
        return Math.ceil(this.state.postsLength / this.state.perPage);
    }

    prevPage = (e) => {
        e.preventDefault();
        var current_page = this.state.current_page;
        if (current_page > 1) {
            let p = current_page - 1;
            this.setState({ current_page: p })
            this.changePage(p);
        }
    }

    nextPage = (e) => {
        e.preventDefault();
        var current_page = this.state.current_page;
        if (current_page < this.numPages()) {
            let p = current_page + 1;
            this.setState({ current_page: p })
            this.changePage(p);
        }
    }

    changePage = (page) => {
        // Validate page
        if (page < 1) page = 1;
        if (page > this.numPages()) page = this.numPages();

        if(this.state.posts.length === 0) return;

        let historyRows = [];

        for (var i = (page-1) * this.state.perPage; i < (page * this.state.perPage); i++) {
            let array = this.state.posts[i];

            if(!__.isUndefined(array)) {
                let row = <Block key={__.toString(array.gid)} tab={true} clicked={this.props.clicked} array={array} />;
                historyRows.push(row);
            }
        }
        this.setState({ historyRow: historyRows });
        this.setState({ page: page });
        
        if (page === 1) {
            this.setState({ pdisabled: true });
        } else {
            this.setState({ pdisabled: false });
        }

        if (page === this.numPages()) {
            this.setState({ ndisabled: true });
        } else {
            this.setState({ ndisabled: false });
        }
    }

    render(){
        return (
            <>
                {this.state.loading ?
                    <div className="text-center">
                        <div className="spinner-grow text-white my-3" role="status"/>
                    </div>
                :
                <>
                    <div className={'table-responsive last-bets cq num-style mb-0'}>
                        <Table className={"game-table mb-0 " + this.state.font}>
                            <thead>
                            <tr>
                                <th>GAME ID</th>
                                <th>RESULT</th>
                                <th>DATE TIME</th>
                                <th className={'text-center'}>HASH</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.historyRow}
                            </tbody>
                        </Table>
                        <div className={this.state.padding}>
                            <div className="pagination">
                                <span className="font-12 flex-center">
                                    Page: <span>{this.state.page}</span>
                                </span>
                                <div>
                                    <span className="page-item">
                                        <button className="btn bg-cs2 mr-1 btn-xs" disabled={this.state.pdisabled} onClick={this.prevPage}>Prev</button>
                                    </span>
                                    <span className="page-item">
                                        <button className="btn bg-cs2 btn-xs" disabled={this.state.ndisabled} onClick={this.nextPage}>Next</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                }
            </>
        );
    }
}

class Block extends React.Component {
    verifyHash(hash){
        Event.emit('game_verify', hash)
    }
    render(){
        let { clicked } = this.props;
        let { gid, busted, hash, date } = this.props.array;

        busted = __.toNumber(busted).toFixed(2);

        let color = (busted >= 1.9 ? 'success' : 'danger');
//        console.log(this.props.array);

        return(
            <tr key={gid} className={'q-crash text-center'}>
                <td className="text-left">
                    <GameModal clicked={clicked} game_id={gid} title={(gid)} color={color} />
                </td>
                <td className="text-left">
                    <GameModal clicked={clicked} game_id={gid} title={(busted + 'x')} color={color} />>
                </td>
                <td className="text-left">
                    {date}
                </td>
                <td className="text-center">
                    <div className="cpt txt-clip" onClick={() => { this.verifyHash(hash) }}>
                        {hash.substr(0,60) + '...'}
                    </div>
                </td>
            </tr>
        );
    }
}

export default History;