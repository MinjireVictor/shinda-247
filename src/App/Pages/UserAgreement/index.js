import React from 'react';
import {Helmet} from 'react-helmet';
import AgreementContent from './AgreementContent';

export default class UserAgreement extends React.Component {

    goBack = () => {
        this.props.history.goBack();
    };

    render(){
        return(
            <>
                <Helmet>
                    <title>User Agreement - Original Crash Game</title>
                </Helmet>
                <div  className={'card p-2 mb-2'}>
                    <div className="m-auto text-center">
                        <h2 className={'text-center mb-2 pb-1 hdr flex'}>
                            <span onClick={this.goBack} className="cpt hvw" title="go back">
                                <i className="fa fa-chevron-left font-20 aligdsn-top ml-3 mr-2 mt-1" />
                            </span>
                            <span className="flex-1"><span className="linear-cl">User Agreement</span></span>
                        </h2>
                        <div className="text-left card-auto">
                            <AgreementContent />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}