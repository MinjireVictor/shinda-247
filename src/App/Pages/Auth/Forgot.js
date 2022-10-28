import React, { Component } from "react";
import {
  isEmail,
  decode,
  encode,
  sendNotfication,
  wait,
} from "../../../Helper";
import socket from "../../../Socket";
import C from "../../../Constant";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      disabled: false,
      submitted: false,
      email: "",
    };
  }

  componentWillMount() {
    wait(500).then(() => {
      this.setState({ loading: false });
    });
  }

  componentDidMount() {
    socket.on(C.RESET_PASSWORD, (data) => this.resetPassword(decode(data)));
  }

  resetPassword = (data) => {
    let response = data;
    const { t } = this.props;

    this.setState({ disabled: false, submitted: false });

    if (response.status) {
      return sendNotfication(
        t("your_password_sended_to_email"),
        "success",
        "top-center"
      );
    } else {
      return sendNotfication(
        t("this_email_is_not_registred_on_our_system"),
        "warning",
        "top-center"
      );
    }
  };

  submitForm(e) {
    e.preventDefault();
    const { t } = this.props;
    const email = this.state.email;
    this.setState({ submitted: true });

    // if (!email) {
    //     return;
    // }
    // if(!isEmail(email)) {
    //     return sendNotfication(t('please_enter_valid_email_address'), 'warning','top-center');
    // }

    this.setState({ disabled: true });

    wait(700).then(() => {
      socket.emit(C.RESET_PASSWORD, encode({ email: this.state.email }));
    });
  }

  goBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { submitted, email, disabled } = this.state;
    const { t } = this.props;
    return (
      <>
        <Helmet>
          <title>Forgot Password - Original Crash Game</title>
        </Helmet>

        <div className="m-auto col-xl-9 p-0 col-sm-12">
          <div className="card mb-2">
            <div className="card-body p-1">
              <h2 className={"text-center mb-2 pb-2 hdr flex"}>
                {/* Converted from a span to a link */}
                {/* <span onClick={this.goBack} className="cpt hvw" title="go back">
                                    <i className="fa fa-chevron-left font-20 aligdsn-top ml-3 mr-2 mt-1" />
                                </span> */}
                <Link to={"/"} className="cpt hvw">
                  <i className="fa fa-chevron-left font-20 aligdsn-top ml-3 mr-2 mt-1" />
                </Link>

                <span className="flex-1">
                  <span className="linear-cl">Forgot Password</span>
                </span>
              </h2>

              <div className={"m-auto min-form"}>
                <div className="px-3">
                  <div className="text-center auth-logo-text">
                    <p className="mt-2 text-white">
                      Enter your phone number to reset password
                    </p>
                  </div>
                  <form className="my-4" onSubmit={(e) => this.submitForm(e)}>
                    <div className="form-group text-center">
                      <div className="form-group">
                        <div className="input-group">
                          <div className="input-group-append">
                            <span className="input-group-text bgp">Phone</span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            name="email"
                            placeholder={"07XXX"}
                            autoComplete={"off"}
                            onChange={(e) =>
                              this.setState({ email: e.target.value })
                            }
                          />
                          {submitted && !email && (
                            <div className="help-block">
                              {t("email_is_required")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="form-group mt-2 text-center">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block font-weight-bold no-shadow"
                        disabled={disabled}
                      >
                        <i className="mdi mdi-email" /> Send Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Forgot;
