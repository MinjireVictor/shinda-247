import React, { Component } from 'react';
import { withRouter, Link } from "react-router-dom";
import socket from "../../../Socket";
import storage from "../../../Storage";
import {decode, encode, wait} from "../../../Helper";
import C from "../../../Constant";
import { Helmet } from "react-helmet";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            phone: '',
            aff: storage.getKey('aff') ? storage.getKey('aff') : null,
            password: '',
            reg: true,
            status: false,
            disabled: false,
            submitted: false,
            ruleChecked: false,
            showPass: false
        };
        this.submitForm = this.submitForm.bind(this);
    }

    componentDidMount() {
        socket.on(C.REGISTER_USER, data => this.setRegister(decode(data)));
    }

    setRegister = (data) => {
        let response = data;

        if(response.status === true)
        {
            this.setState({ status: "Successfully Registered. Please Wait...", submitted: false});
            wait(1000).then(() => {
                socket.emit(C.LOGIN_USER, encode({
                    username: this.state.username,
                    password: this.state.password,
//                    recaptcha: 'google'
                }));
            })
        }
        else {
            this.setState({ disabled: false, status: response.status, submitted: false});
        }
    };

//    handleShow(e){
//        this.setState({ show: true, effect: 'zoomIn' });
//    }
//
//    handleClose(){
//        this.setState({ show: false, effect: 'zoomOut', submitted: false });
//        if (this.props.clicked) this.props.clicked();
//    }

    submitForm(e){
        e.preventDefault();
        const { t } = this.props;

        this.setState({ submitted: true, disabled: true, status: t('please_wait') });

        const { username, phone, password, reg, aff, ruleChecked } = this.state;

        if (!(username && password && phone)) {
            this.setState({ status: false, disabled: false});
            return;
        }

        if(username.length < 5) {
            this.setState({ status: t("please_enter_username_more_than_5_words"), disabled: false,  });
            return;
        }

        if(!ruleChecked){
            this.setState({ status: "Please accept user agreement and age rule check", disabled: false,  });
            return;
        }

//        this.setState({ username: username, password: password });

        socket.emit(C.REGISTER_USER, encode({
            username: username,
            password: password,
            country: 'turkey',
            email: phone,
            method: reg,
            aff: aff
        }));
    }

    checkRule = e => {
        this.setState({ ruleChecked: !this.state.ruleChecked});
    }

    goBack = () => {
        this.props.history.goBack();
    }

    closeStatus = () => {
        this.setState({ status: false });
    }

    handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    handleShowPass = () => {
        this.setState({ showPass: !this.state.showPass});
    }

    render(){
        const { submitted, phone, username, password, ruleChecked, disabled, status, showPass } = this.state;
        const showPassCls = showPass ? 'fa-eye-slash' : 'fa-eye';
        const { t } = this.props;
        return (
            <>
                <Helmet>
                    <title>Register - Original Crash Game</title>
                </Helmet>
                <div className="m-auto col-xl-9 p-0 col-sm-12">
                    <div className="card mb-2">
                        <div className="card-body p-1">
                            <h2 className={'text-center mb-2 pb-2 hdr flex'}>
                                <span onClick={this.goBack} className="cpt hvw" title="go back">
                                    <i className="fa fa-chevron-left font-20 aligdsn-top ml-3 mr-2 mt-1" />
                                </span>
                                <span className="flex-1"><span className="linear-cl">Register</span></span>
                            </h2>

                            <div className={"m-auto min-form"}>
                                <div className="px-3">
                                    <form className="form-horizontal auth-form my-4" onSubmit={ (e) => { this.submitForm(e) }}>
                                        <div className="form-group mb-3">
                                            <div className="input-group">
                                                <div className="input-group-append">
                                                    <span className="input-group-text bgin">Phone</span>
                                                </div>
                                                <input type="text"
                                                       name="phone"
                                                       className="form-control"
                                                       value={phone}
                                                       autoComplete="off"
                                                       onChange={this.handleChange}
                                                />
                                                {submitted && !phone &&
                                                    <div className="help-block">Phone Number is Required</div>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group mb-2">
                                            <div className="input-group">
                                                <div className="input-group-append">
                                                    <span className="input-group-text bgin">{t('username')}</span>
                                                </div>
                                                <input type="text"
                                                       name="username"
                                                       className="form-control"
                                                       value={username}
                                                       autoComplete="off"
                                                       onChange={this.handleChange}
                                                />
                                                {submitted && !username &&
                                                    <div className="help-block">{t('username_is_required')}</div>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group mt-3">
                                                <div className="input-group">
                                                    <div className="input-group-append">
                                                        <span className="input-group-text bgin">{t('password')}</span>
                                                    </div>
                                                    <input type={showPass ? "text" : "password"}
                                                           name={'password'}
                                                           className="form-control"
                                                           value={password}
                                                           autoComplete="off"
                                                           onChange={this.handleChange}
                                                    />
                                                    <span className="show-pass cpt hvw" onClick={this.handleShowPass}>
                                                        <i className={"fas " + showPassCls}></i>
                                                    </span>
                                                    {submitted && !password &&
                                                        <div className="help-block">{t('password_is_required')}</div>
                                                    }
                                                </div>
                                        </div>
                                        <div className="form-group mt-2 ml-2 mb-2">
                                            <div className="checkbox checkbox-purple form-check-inline font-11 mx-0">
                                                <input type="checkbox" id="inlineCheckbox1" value="rule" checked={ruleChecked} onChange={this.checkRule} />
                                                <label className="font-11 mb-0" htmlFor="inlineCheckbox1">
                                                    I have read and accept <Link to={'/terms'} className="text-yellow">{t('user_agreement')}</Link> ,
                                                    and confirm that i am 18 years and above.
                                                 </label>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button className="btn btn-primary btn-block font-weight-bold no-shadow" disabled={disabled}>
                                            <i className="mdi mdi-login mr-1 float-left font-18" /> {t('register')}
                                            </button>
                                        </div>

                                        {status &&
                                            <div className={'alert bg-secondary text-white mt-2 mb-0 flex'}>
                                                <span className="flex-1">{ status }</span>
                                                <button type="button" className="close font-18" onClick={this.closeStatus}>
                                                    <i className={'mdi mdi-close'}/>
                                                </button>
                                            </div>
                                        }
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

export default withRouter(Register);