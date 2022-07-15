import React from 'react';
import storage from "../../../Storage";

export default class Bonus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: storage.getKey('token')
        };
    }

    componentWillMount() {
        if(this.state.token === null)
        {
            if(this.props.params)
            {
                let path = this.props.params.pathname;
                let tk = path.replace('/aff/','');
                if(tk){
                    storage.setKey('aff', tk);
                    this.props.history.push('/register');
                }
            }
        }
        else {
            this.props.history.push('/');
        }
    }

    render(){
        return(
            <>
            </>
        );
    }
}