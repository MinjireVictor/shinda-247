import React, { Component, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Cookies from "js-cookie";
//import ReCAPTCHA from "react-google-recaptcha";
import storage from "../../../Storage";
//import GoogleBtn from "./Google";
import socket from "../../../Socket";
import { wait, decode, encode, randomString } from "../../../Helper";
import C from "../../../Constant";
import { Helmet } from "react-helmet";
import { onLoginClosed, isLoggedIn } from "../../../actions/login.action";
import { useDispatch } from "react-redux";
import { Dispatcher } from "../../Dispatchers/dispatchers";
import { LOGIN_TYPES } from "../../types/login.types";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      username: "",
      password: "",
      status: false,
      submitted: false,
      disabled: false,
      showPass: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    console.log("Login component ", "-- Component mounting... " + socket.on);
    socket.on(C.LOGIN_USER, (data) => {
      console.log("Login component mounted ", data);
      this.setLogin(decode(data));
    });
  }

  setLogin = (data) => {
    if (data.status === true) {
      this.setState({ status: "Successfully Login, Please Wait..." });
      Cookies.remove("session");
      Cookies.set("session", data.token, { expires: 14 });
      storage.setKey("token", data.token);

      //FAKES
      storage.setKey("user_token", randomString(50));
      storage.setKey("jwt_token", randomString(50));
      storage.setKey("secret_user", randomString(44));
      storage.setKey("secret_realtime", randomString(50));
      storage.setKey("security_key", randomString(10));
      storage.setKey("token_key", randomString(64));
      storage.setKey("secret_token", randomString(64));

      //REALS
      storage.setKey("name", data.name);
      storage.setKey("avatar", data.avatar);
      storage.setKey("email", data.email);
      storage.setKey("credit", data.credit);
      storage.setKey("room", data.room);
      storage.setKey("friends", data.friends);

      socket.emit(
        C.ONLINE,
        encode({
          jwt_token: storage.getKey("jwt_token"),
          user_token: storage.getKey("user_token"),
          security_key: storage.getKey("security_key"), //fake
          secret_user: storage.getKey("secret_user"), //fake
          secret_realtime: storage.getKey("secret_realtime"), //fake
          client_system: storage.getKey("client_system"), //fake
          token_key: storage.getKey("token_key"), //fake
          secret_token: storage.getKey("secret_token"), //fake
          token: data.token, // REAL
        })
      );

      // this.props.history.push("/");

      wait(1000).then(() => {
        // window.location.reload();
      });
    } else {
      this.setState({ status: data.status, submitted: false, disabled: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    this.setState({
      submitted: true,
      disabled: true,
      status: this.props.t("please_wait"),
    });

    const { username, password } = this.state;

    if (!(username && password)) {
      this.setState({ disabled: false, status: false });
      return;
    }

    //Execute Recaptcha Token
    // const token = await this.recaptchaRef.current.executeAsync();

    wait(1000).then(() => {
      socket.emit(
        C.LOGIN_USER,
        encode({
          username: username,
          password: password,
          //                recaptcha: 'google'
        })
      );
    });
  };

  //    recaptchaChange = (value) => {
  //        this.setState({ recaptcha: value });
  //    };

  goBack = () => {
    this.props.history.goBack();
  };

  closeStatus = () => {
    this.setState({ status: false });
  };

  handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

  handleShowPass = () => {
    this.setState({ showPass: !this.state.showPass });
  };

  hangleLoginClicked = (event) => {
    Dispatcher(LOGIN_TYPES.LOGIN_CLOSED);
  };
  handleForgotPasswordClicked = (event) => {
    Dispatcher(LOGIN_TYPES.LOGIN_CLOSED);
  };
  dispatchIsLoggedIn = () => {
    Dispatcher(LOGIN_TYPES.IS_LOGGED_IN, true);
  };

  render() {
    const { t, mobile } = this.props;
    const { disabled, status } = this.state;
    const cls = mobile ? "col-xl-9 p-0 col-sm-12" : "";
    const form_cls = mobile ? "my-4 px-3" : "";
    return (
      <>
        {mobile && (
          <Helmet>
            <title>User Login - Original Crash Game</title>
          </Helmet>
        )}

        <div className={"m-auto " + cls}>
          <div className="card mb-2">
            <div className="card-body p-1">
              <Header back={this.goBack} mobile={mobile} />
              <form
                className={"form-horizontal " + form_cls}
                onSubmit={(e) => {
                  this.handleSubmit(e);
                }}
              >
                <div className={"m-auto min-form"}>
                  {mobile ? (
                    <>
                      <FormInputs
                        t={t}
                        mobile={mobile}
                        handleChange={this.handleChange}
                        handleShowPass={this.handleShowPass}
                        dispatchIsLoggedIn={this.dispatchIsLoggedIn}
                        state={this.state}
                      />
                      <div className="text-center">
                        <button
                          className="btn btn-primary btn-block font-weight-bold no-shadow"
                          disabled={disabled}
                        >
                          <i className="mdi mdi-login mr-1 float-left font-18" />{" "}
                          {t("login_to_site")}
                        </button>
                      </div>
                      <div className="text-center mb-3 like-row">
                        <div className="my-1 text-left txt-clip">
                          <Link to={"/register"}>Need Account?</Link>
                        </div>
                        <div className="my-1 text-right txt-clip">
                          <Link to={"/forgot_password"}>Forgot Password?</Link>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex">
                        <FormInputs
                          t={t}
                          mobile={mobile}
                          handleChange={this.handleChange}
                          handleShowPass={this.handleShowPass}
                          state={this.state}
                        />
                      </div>
                      <div className="like-row m-1">
                        <div className="text-left">
                          <Link
                            to={"/register"}
                            className="btn btn-link txt-clip"
                            // onClick={this.hangleLoginClicked}
                          >
                            Need Account?
                          </Link>
                        </div>
                        <div className="text-center">
                          <Link
                            to={"/forgot_password"}
                            className="btn btn-link txt-clip"
                          >
                            Forgot Password?
                          </Link>
                        </div>
                        <div className="text-right">
                          <button
                            className="btn btn-primary btn-block font-weight-bold no-shadow"
                            disabled={this.state.disabled}
                          >
                            <i className="mdi mdi-login mr-1 float-left font-18" />{" "}
                            {t("login")}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {status && (
                    <div className={"alert alert-success text-white mb-0 flex"}>
                      <span className="flex-1">{status}</span>
                      <button
                        type="button"
                        className="close font-18"
                        onClick={this.closeStatus}
                      >
                        <i className={"mdi mdi-close"} />
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

class Header extends React.Component {
  render() {
    const { mobile, back } = this.props;
    return (
      <>
        {mobile ? (
          <h2 className={"text-center mb-2 pb-2 hdr flex"}>
            <span onClick={back} className="cpt hvw" title="go back">
              <i className="fa fa-chevron-left font-20 aligdsn-top ml-3 mr-2 mt-1" />
            </span>
            <span className="flex-1">
              <span className="linear-cl">User Login</span>
            </span>
          </h2>
        ) : (
          <></>
        )}
      </>
    );
  }
}

const FormInputs = ({ t, mobile, handleChange, handleShowPass, state }) => {
  const { submitted, username, password, showPass, status } = state;
  const cls = mobile ? "mb-3" : "m-1";
  const showPassCls = showPass ? "fa-eye-slash" : "fa-eye";
  const dispatch = useDispatch();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (status === "Successfully Login, Please Wait...") {
      setLoggedIn(true);
    }
  }, [status]);

  useEffect(() => {
    if (loggedIn) {
      dispatch(isLoggedIn(true));
      dispatch(onLoginClosed());
    }
  }, [loggedIn]);

  const handleClosePopup = (event) => {
    dispatch(onLoginClosed());
  };

  return (
    <>
      {/* Add the close button here */}

      <div className={"form-group flex-1 " + cls}>
        <div className="input-group">
          <div className="input-group-append">
            <span className="input-group-text bgp">
              {mobile ? t("username") : <i className="fas fa-user font-18" />}
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            name="username"
            value={username}
            autoComplete="off"
            onChange={handleChange}
          />
          {submitted && !username && (
            <div className="help-block">{t("username_is_required")}</div>
          )}
        </div>
      </div>
      <div className={"form-group flex-1 " + cls}>
        <div className="input-group">
          <div className="input-group-append">
            <span className="input-group-text bgp">
              {mobile ? t("password") : <i className="fas fa-lock font-18" />}
            </span>
          </div>
          <input
            type={showPass ? "text" : "password"}
            className="form-control"
            name="password"
            value={password}
            autoComplete="off"
            onChange={handleChange}
          />
          <span className="show-pass cpt hvw" onClick={handleShowPass}>
            <i className={"fas " + showPassCls}></i>
          </span>
          {submitted && !password && (
            <div className="help-block">{t("password_is_required")}</div>
          )}
        </div>
      </div>
      <div className="m-2 view overlay zoom" onClick={handleClosePopup}>
        {" "}
        &#10005;{" "}
      </div>
    </>
  );
};

// class FormInputs extends React.Component {

//     render() {
//         const { t, mobile, handleChange, handleShowPass, state } = this.props;
//         const { submitted, username, password, showPass } = state;
//         const cls = mobile ? 'mb-3' : 'm-1';
//         const showPassCls = showPass ? 'fa-eye-slash' : 'fa-eye';
//         return (
//             <>
//             {/* Add the close button here */}

//                 <div className={"form-group flex-1 " + cls}>
//                     <div className="input-group">
//                         <div className="input-group-append">
//                             <span className="input-group-text bgp">{mobile ? t('username') : <i className="fas fa-user font-18" />}</span>

//                         </div>
//                         <input type="text"
//                                className="form-control"
//                                name="username"
//                                value={username}
//                                autoComplete="off"
//                                onChange={handleChange}
//                         />
//                         {submitted && !username &&
//                             <div className="help-block">{t('username_is_required')}</div>
//                         }
//                     </div>
//                 </div>
//                 <div className={"form-group flex-1 " + cls}>
//                     <div className="input-group">
//                         <div className="input-group-append">
//                             <span className="input-group-text bgp">{mobile ? t('password') : <i className="fas fa-lock font-18" />}</span>
//                         </div>
//                         <input type={showPass ? "text" : "password"}
//                                className="form-control"
//                                name="password"
//                                value={password}
//                                autoComplete="off"
//                                onChange={handleChange}
//                         />
//                         <span className="show-pass cpt hvw" onClick={handleShowPass}>
//                             <i className={"fas " + showPassCls}></i>
//                         </span>
//                         {submitted && !password &&
//                             <div className="help-block">{t('password_is_required')}</div>
//                         }
//                     </div>
//                 </div>
//                 <div className="m-2 view overlay zoom"> &#10005; </div>
//             </>
//         );
//     }
// }

export default Login;
