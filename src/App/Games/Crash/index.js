import React from 'react';
import {Row, Col, Card} from "react-bootstrap";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import {isMobile, wait, Event} from "../../../Helper";
import storage from "../../../Storage";
import BankRoll from "../../Components/Game/BankRoll";
//import Engine from "./Engine";
import Canvas from "./Graphic";
//import MobileCanvas from "./Graphic/Mobile";
import HistoryList from "./includes/HistoryList";
import Bet from "./Bet";
import Queue from "./Queue";
//import C from "../../../Constant";

class Index extends React.Component {
    _Mounted = false;
    constructor (props) {
        super(props);
        this.state = {
            height: null,
            mobile: false,
            isLogged: false,
            token: false,
            padding: "p-1"
        };
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        wait(600).then(() => {
            this.handleResize();
        });
        window.addEventListener('resize', this.handleResize);

        if(storage.getKey('token')){
            this.setState({ isLogged: true, token: storage.getKey('token') });
        }

        wait(500).then(() => {
            this._Mounted = true;
//            Engine.getStatus();
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        this.setState = (state,callback)=>{
            return;
        };
    }

    handleResize(){
        if(this.getWidth() < 1540)
        {
            this.setState({ col: 'col-xl-12'});
            Event.emit('hide_games');
        }
        else {
            this.setState({ col: 'col-xl-9'});
            Event.emit('show_min_games');
        }

        if(isMobile()){
            this.setState({ mobile: true });
        }
        else {
            this.setState({ mobile: false });
        }

        if(isMobile()){
            this.setState({ padding: 'p-1', ovh: 'ovh' });
        }
    }

    getWidth(){
        return document.documentElement.clientWidth || document.body.clientWidth;
    }

    render(){
        let { col, padding, ovh } = this.state;
        return(

            <>
                <ReactCSSTransitionGroup
                    transitionAppear={true}
                    transitionAppearTimeout={250}
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={200}
                    transitionName={'SlideIn'}
                >
                    {this._Mounted ?
                    <div className={ "animated fadeIn " + ovh}>
                        <Col sm={12} className={'m-auto ' + col + ' p-0'}>

                            {/* History List */}
                            <Card className="mb-2 animated zoomIn">
                                <Card.Body className="p-1">
                                    <HistoryList />
                                </Card.Body>
                                <Card.Body className={'p-1 animated zoomIn'} id="roll-panel">
                                     <Canvas mobile={this.state.mobile}/>
                                </Card.Body>
                            </Card>

                            {/* BET */}
                            <Card className="mb-0">
                                <Card.Body className={padding}>
                                    <Row>
                                        <Col sm={12} md={12} className={'m-auto pt-1'}>
                                            <BankRoll game={'crash'} style={{position: 'absolute', right: 16}} />
                                            <Bet mobile={this.state.mobile} token={this.state.token} isLogged={this.state.isLogged}/>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* QUEUE */}
                            <Card className="mb-2">
                                <Card.Body className="p-1">
                                    <Row>
                                        <Col sm={12} md={12} className={'m-auto px-1'}>
                                            <Queue t={this.props.t}/>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </div>
                    :
                    <div className="game-loader text-center">
                        <div className="spinner-grow text-info my-3" role="status"/>
                    </div>
                    }
                </ReactCSSTransitionGroup>
            </>
        );
    }
}

export default Index;