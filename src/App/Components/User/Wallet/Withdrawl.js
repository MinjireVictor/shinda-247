import React, { Component } from "react";
//import ReactTooltip from "react-tooltip";
import socket from "../../../../Socket";
import { decode, encode, wait } from "../../../../Helper";
import storage from "../../../../Storage";
import C from "../../../../Constant";

//_isMounted can prevent from double socket response

class Withdrawl extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            token: storage.getKey('token'),
            currentCoin: 'KSH',
            loading: true,
            credits: {},
            status: false,
            disabled: false,
            submitted: false,
            phone: storage.getKey('email') || '',
            amount: '',
            cls: 'bg-secondary'
        };
    }

    componentDidMount() {
        this._isMounted = true;
        socket.emit(C.CREDIT, encode({ token: this.state.token, coin: this.state.currentCoin }));
        socket.on(C.CREDIT, data => this.getCreditAndCoins(decode(data)));
        socket.on(C.SUBMIT_NEW_WITHDRAWL, data => this.addWithdrawal(decode(data)));
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    getCreditAndCoins = (data) => {
        if (this._isMounted) {
            let { credit } = data;
            this.setState({ credits: credit, loading: false });
        }
    };

    addWithdrawal(data){
        if (this._isMounted) {
            if (data.code === 0) {
                this.setState({ status: data.response, submitted: false, cls: 'alert-success'});
                wait(15000).then(() => {
                    socket.emit(C.CREDIT, encode({ token: this.state.token, coin: this.state.currentCoin }));
                    this.setState({ disabled: false, status: false });
                });
            } else {
                this.setState({ disabled: false, status: data.response, submitted: false, cls: 'alert-danger'});
            }
        }
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

    submitForm(e){
        e.preventDefault();

        this.setState({ submitted: true, disabled: true, status: 'please wait..', cls: 'bg-secondary' });

        const { phone, amount, token } = this.state;

        if (!( phone && amount )) {
            this.setState({ status: false, disabled: false});
            return;
        }

        if(amount < 50) {
            this.setState({ status: "minimum Withdrawal amount is 50.00 KSH", disabled: false,  cls: 'alert-warning' });
            return;
        }

        this.setState({ status : "please wait, withdrawal to " + phone + "..", cls: 'bg-secondary' });
        socket.emit(C.SUBMIT_NEW_WITHDRAWL, encode({
            token: token,
            amount: amount,
            msisdn: phone
        }));
    }

    render() {
        const { submitted, phone, amount, disabled, status, cls } = this.state;
        return (
            <>
                <div className={'animated'}>
                    { this.state.loading ?
                        <div className="ycenter text-center">
                            <div className="spinner-border text-info" role="status" />
                        </div>
                        :
                        <>
                            <div className={"m-auto min-form"}>
                                <div className="lrow text-center text-white p-1 ycenter">
                                    <div className="border-right">
                                        <span className="font-15">Balance</span>
                                    </div>
                                    <div className="text-center mt-1 font-17">
                                        <span>{this.state.currentCoin} </span>
                                        <span className="text-yellow">{this.state.credits.kshs}</span>
                                    </div>
                                </div>
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
                                                       placeholder="2547XXXXXXXX"
                                                       onChange={this.handleChange}
                                                />
                                                {submitted && !phone &&
                                                    <div className="help-block">Phone Number is Required</div>
                                                }
                                            </div>
                                        </div>
                                        <div className="form-group mb-3">
                                            <div className="input-group">
                                                <div className="input-group-append">
                                                    <span className="input-group-text bgin">Amount</span>
                                                </div>
                                                <input type="number"
                                                       name="amount"
                                                       className="form-control"
                                                       value={amount}
                                                       autoComplete="off"
                                                       placeholder="Amount to Withdraw (KSH)"
                                                       onChange={this.handleChange}
                                                />
                                                {submitted && !amount &&
                                                    <div className="help-block">Amount to Withdraw is required</div>
                                                }
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button className="btn btn-primary btn-block font-weight-bold no-shadow" disabled={disabled}>
                                            <i className="fas fa-arrow-up mr-1 float-left font-18" /> Make Withdrawal
                                            </button>
                                        </div>

                                        {status &&
                                            <div className={'alert text-white mt-3 mb-0 flex ' + cls}>
                                                <span className="flex-1">{ status }</span>
                                                <button type="button" className="close font-18" onClick={this.closeStatus}>
                                                    <i className={'mdi mdi-close'}/>
                                                </button>
                                            </div>
                                        }
                                    </form>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </>
        );
    }
}

export default Withdrawl;