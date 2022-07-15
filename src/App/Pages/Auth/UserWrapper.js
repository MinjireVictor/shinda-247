import React from 'react';
import { ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Login from './Login';
import User from "../Parts/User";
import Credit from "../Parts/Credit";
import Notifications from "../Parts/Notification";
import { withRouter } from 'react-router-dom';

class UserWrapper extends React.Component {

    render() {
        const { t, isLoggedIn, mobile, history } = this.props;
        return (
            <>
                {isLoggedIn ?
                    <div className="like-row">
                        <Credit t={t} history={history} />
                        <ButtonGroup>
                            <User t={t} history={history} />
                            <Notifications t={t} />
                        </ButtonGroup>
                    </div>
                :
                    <>
                    {mobile ?
                        <div className="like-row">
                            <div className="text-left test">
                                <Link to={'/register'} className="btn btn-link txt-clip">Need Account?</Link>
                            </div>
                            <div className="text-center">
                                <Link to={'/login'} className="btn btn-link txt-clip">User Login</Link>
                            </div>
                        </div>
                    :
                        <Login t={t} mobile={mobile} />
                    }
                    </>
                }
            </>
        );
    }
}

export default withRouter(UserWrapper);