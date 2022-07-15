import React from "react";
//import PerfectScrollbar from 'perfect-scrollbar';
import { wait, isMobile, isTablet, Event } from "../../../../Helper";
import Messages from "./Messages";
import Submit from "./Submit";
import Country from "./Country";
import Rain from "./Rain";
import Rules from "./Rules";

const chatSideBarWidth = 330;

class Chat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: false
        };
    }

    componentDidMount() {
        if(isMobile() || isTablet()){
            this.setState({ show: false });
        }
        window.addEventListener('resize', this.handleResize);

        wait(500)
            .then( () => {
                this.handleResize();
        });

        Event.on('toggle_sidebar', () => {
            wait(100)
                .then( () => {
                    this.handleResize();
                });
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
//        const pageContent = document.querySelector('#page-content');
//        let clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
//        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
//
//        if(pageContent !== null)
//        {
//            let space = 250;
//
//            const leftSidebar = document.querySelector('.left-sidenav');
//            const games = document.querySelectorAll('.game-image');
//
//            if(hasClass(leftSidebar, 'min') || !this.state.show)
//            {
//                space -= 170;
//
//                if(!isMobile()){
//                        games.forEach((g, i) => {
//                            if(g !== null)
//                                g.style.height = 160 + 'px';
//                        })
//                    }
//            }
//            else {
//                games.forEach((g, i) => {
//                    if(g !== null)
//                        g.style.height = 120 + 'px';
//                })
//            }
//
//            let pWidth = this.state.show === true ? clientWidth - (chatSideBarWidth + space): clientWidth;
//            pageContent.style.width = pWidth + 'px';
//
//            if(pWidth < 960){
//                Event.emit('hide_games');
//            }
//        }
//
//        if(!isMobile()){
//            this.setState({height: clientHeight - 170});
//        }
//        else {
//            this.setState({height: clientHeight - 180});
//        }
    };

    setSide = () => {
        this.setState({ show: !this.state.show });

        wait(150).then( () => {
            this.handleResize();
        });
    };

    render(){
        const { t } = this.props;
        return(
            <>
                {!this.state.show &&
                    <button onClick={this.setSide} className="btn btn-primary btn-block font-weight-bold chat-btn hvs">
                        <i className="fas fa-comments font-18" />
                    </button>
                }
                 { this.state.show && <Content t={t} height={this.state.height} close={this.setSide} show={this.state.show} /> }
            </>
        );
    }
}

class Content extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: chatSideBarWidth + 'px'
        };
        this.chatRef = React.createRef();
    }

    componentDidMount() {
//        loadScroll();
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
        if (this.props.show) {
//            this.chatRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
//            window.scrollTo(0, this.chatRef.current.offsetTop);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        if(isMobile()){
            this.setState({ width: '100%' })
        }
        else {
            this.setState({ width : chatSideBarWidth + 'px'})
        }
    };

    render() {
        const { t } = this.props;
        return (
            <>
                <div className={'chat-wrapper m-1 animated slideInRight'} ref={this.chatRef}>
                    <div className="card h-100 mb-0">
                        <div className="flex-column">
                            <h6 className="menu-title pl-2 m-1">
                                <Country t={t}/>
                                <li className="float-right">
                                    <button type="button" className="hvi btn btn-xs mt-3" onClick={this.props.close}>
                                        <i className={'mdi mdi-close font-20'}/>
                                    </button>
                                </li>
                                <Rules t={t} />
                                <Rain t={t}/>
                            </h6>
                            <div id="messages" className="flex-1 ova">
                                <Messages t={t}/>
                            </div>
                            <Submit t={t}/>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

//function loadScroll(){
//    if(document.getElementById('messages') !== null){
//        let ps = new PerfectScrollbar('#messages', {
//            wheelSpeed: 1,
//            suppressScrollX: true,
//            wheelPropagation: true,
//            minScrollbarLength: 2
//        });
//        ps.update();
//    }
//}

//function hasClass(element, className) {
//    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
//}

export default Chat;