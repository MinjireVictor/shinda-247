import React from "react";
import {Modal} from "react-bootstrap";
import PerfectScrollbar from 'perfect-scrollbar';
import { wait, isMobile, isTablet, Event, __ } from "../../../../Helper";
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
            show: true
        };
    }

    componentDidMount() {
        if(isMobile() || isTablet()){
            this.setState({ show: true });
        }
        window.addEventListener('resize', this.handleResize);

        // wait(500)
        //     .then( () => {
        //         this.handleResize();
        // });

        // Event.on('toggle_sidebar', () => {
        //     wait(100)
        //         .then( () => {
        //             this.handleResize();
        //         });
        // })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        const pageContent = document.querySelector('#page-content');
        let clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
        const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

        if(pageContent !== null)
        {
            let space = 250;

            const leftSidebar = document.querySelector('.left-sidenav');
            const games = document.querySelectorAll('.game-image');

            if( !this.state.show)
            {
                space -= 170;

                if(!isMobile()){
                        games.forEach((g, i) => {
                            if(g !== null)
                                g.style.height = 160 + 'px';
                        })
                    }
            }
            else {
                games.forEach((g, i) => {
                    if(g !== null)
                        g.style.height = 120 + 'px';
                })
            }

            let pWidth = this.state.show === true ? clientWidth - (chatSideBarWidth + space): clientWidth;
            pageContent.style.width = pWidth + 'px';

            if(pWidth < 960){
                Event.emit('hide_games');
            }
        }

        if(!isMobile()){
            this.setState({height: clientHeight - 170});
        }
        else {
            this.setState({height: clientHeight - 180});
        }
    };

    setSide = () => {
        this.setState({ show: !this.state.show });

        wait(1)
            .then( () => {
                // this.handleResize();
            });
    };

    render(){
        const { t } = this.props;
        return(
            <>
<Content t={t} height={this.state.height} /> 
                 
            </>
        );
    }
}

class Content extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: '100%'
        }
    }

    componentDidMount() {
        loadScroll();
        // this.handleResize();
        window.addEventListener('resize', this.handleResize);
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
                <div className={'custom-navy '} style={{ width: '100%' }}>
                    <div className="menu-body slimscroll">
                    <div className="title-box " style={{ width: '100%',  backgroundColor: '#31343c',padding:'5px'  }}>
                                Chat
                            </div>
                        <div className="main-icon-menu-pane active p-2">
                           
                            <div id="messages" style={{height: 'auto'}}>
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

function loadScroll(){
    if(document.getElementById('messages') !== null){
        let ps = new PerfectScrollbar('#messages', {
            wheelSpeed: 1,
            suppressScrollX: true,
            wheelPropagation: true,
            minScrollbarLength: 2
        });
        ps.update();
    }
}

function hasClass(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className+ ' ') > -1;
}

export default Chat;