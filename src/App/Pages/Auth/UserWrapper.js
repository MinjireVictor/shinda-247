import React from "react";
import { ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Login from "./Login";
import User from "../Parts/User";
import Credit from "../Parts/Credit";
import Notifications from "../Parts/Notification";
import NewHeader from "../Header/login-header/header";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoginClicked } from "../../../selectors/login.selector";
import { connect } from "react-redux";

class UserWrapper extends React.Component {
  render() {
    const { t, isLoggedIn, mobile, history, credits, onWalletOpened } =
      this.props;

    return (
      <>
        {isLoggedIn ? (
          <div className="like-row">
            <Credit
              t={t}
              history={history}
              balance={credits}
              onWalletOpened={onWalletOpened}
            />
            {/* <ButtonGroup>
                            <User t={t} history={history} />
                            <Notifications t={t} />
                        </ButtonGroup> */}
          </div>
        ) : (
          <>
            {mobile ? (
              <div className="like-row">
                <div className="text-left test">
                  <Link to={"/register"} className="btn btn-link txt-clip">
                    Need Account?
                  </Link>
                </div>
                <div className="text-center">
                  <Link to={"/login"} className="btn btn-link txt-clip">
                    User Login
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {/* <Login t={t} mobile={mobile} /> */}
                <NewHeader t={t} mobile={mobile} />
              </div>
            )}
          </>
        )}
        <div
          style={{
            width: "auto",
            height: "auto",
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: "5",
          }}
        >
          <LoginPopup t={t} mobile={mobile} />
        </div>
        <Outlet />
      </>
    );
  }
}

const LoginPopup = ({ t, mobile }) => {
  const clicked = useSelector(selectIsLoginClicked);

  if (clicked) {
    return <div>{clicked && <Login t={t} mobile={mobile} />}</div>;
  }
  return null;
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.login.isLoggedIn,
  };
};

export default connect(mapStateToProps, {})(UserWrapper);
