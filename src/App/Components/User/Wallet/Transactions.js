import React from 'react';
import storage from "../../../../Storage";
import socket from "../../../../Socket";
import {decode, encode, fixDate} from "../../../../Helper";
import C from "../../../../Constant";

class Transactions extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            token: storage.getKey('token'),
            loading: true,
            transactions: []
        };
    }

    componentDidMount(){
        this._isMounted = true;
        socket.emit(C.WALLET_HISTORY, encode({ token: this.state.token}));
        socket.on(C.WALLET_HISTORY, data => this.makeHistory(decode(data)));
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    makeHistory(data){
        if(this._isMounted)
        {
            let arrayJson = [...data.deposit, ...data.withdrawl];
            let sorted = arrayJson.sort((a,b)=> new Date(b.created).getTime() -
                new Date(a.created).getTime());
            this.setState({ loading: false });
            if(sorted) {
                sorted.forEach((transaction, i) => {
                    let row = <TransactionTable data={transaction} key={i}/>;
                    this.setState(state => ({transactions: [row, ...state.transactions]}));
                });
            }
        }
    }

    render() {
        let { loading } = this.state;
        return (
            <>
                {loading ?
                    <div className="text-center">
                        <div className="spinner-border text-info my-3" role="status" />
                    </div>
                :
                    <>
                        <div className="table-responsive mt-2">
                            <table className="table table-hover transaction">
                                <thead>
                                    <tr>
                                        <th scope="col">Trans ID</th>
                                        <th scope="col">Trans Type</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Created At</th>
                                        <th scope="col">Created By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.transactions.length > 0 &&
                                        this.state.transactions
                                    }
                                </tbody>
                            </table>
                            {this.state.transactions.length === 0 &&
                            <div className="alert bg-soft-dark mt-2 w-100 font-13 text-center text-upper text-yellow">
                                [ No transactions Found for this Account ]
                            </div>
                            }
                        </div>
                    </>
                }
            </>
        );
    }
}

function TransactionTable(props){
    const { reference, account, amount, status, created, created_by, iscredit } = props.data;
    const icon = iscredit ? 'fa-arrow-down' : 'fa-arrow-up';
    return(
            <tr>
                <td>{reference}</td>
                <td><i className={"fas text-drop mr-1 font-13 " + icon}></i> {account}</td>
                <td>{Number(amount).toFixed(2) + ' KSH'}</td>
                <td>{status}</td>
                <td>{fixDate(created)}</td>
                <td>{created_by}</td>
            </tr>
    );
}

export default Transactions;