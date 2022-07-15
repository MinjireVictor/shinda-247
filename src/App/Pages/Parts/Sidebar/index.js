import React from 'react';
import Menu from "./Menu";
import Logo from "../Logo";

class SideBar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            show: true,
            smShow: false
        };
    }

    collapse = () =>{
        this.setState({ show: !this.state.show });
    }
    collapseSm = () => {
        this.setState({ smShow: !this.state.smShow });
    }

    hideSmMenu = () => {
        this.setState({ smShow: false });
    }

    render(){
        const { t } = this.props;
        const show = this.state.show;
        const smShow = this.state.smShow;
        const cls = show ? 'big' : 'min';
        const height = smShow ? '' : ' auto';

        return(
            <>
                <div className={'left-sidenav ova ' + cls + height}>
                    <div className="flex-column">
                        <div className="topbar card mb-0 pt-1 pb-1">
                            <div className="text-right lg-toggle">
                                <button className="button-menu-mobile nav-link" onClick={this.collapse}>
                                    <i className="fas fa-bars"></i>
                                </button>
                            </div>
                            <div className="flex sm-toggle">
                                <div className="flex-1">
                                    <Logo show={show} />
                                </div>
                                <button className="button-menu-mobile nav-link d-none" onClick={this.collapseSm}>
                                    <i className="fas fa-bars"></i>
                                </button>
                            </div>
                        </div>
                        <Menu t={t} type={cls} smShow={smShow} hideSmMenu={this.hideSmMenu} />
                    </div>
                </div>
            </>
        );
    }
}

export default SideBar;