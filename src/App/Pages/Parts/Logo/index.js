import React from "react";
import {Link} from "react-router-dom";
import {BRAND} from "../../../../Helper";

class Logo extends React.Component {
    render() {
        return(
            <>
                <div className="topbar-left">
                    <Link to="/" className="logo">
                            <span>
                                <img src="/assets/images/logo.png" className="logo-sm" alt="Logo" />
                                {this.props.show &&
                                    <span className={"ml-1 font-25 text-logo"}>
                                        <span>{BRAND}</span>
                                    </span>
                                }
                            </span>
                    </Link>
                </div>
            </>
        );
    }
}

export default Logo;