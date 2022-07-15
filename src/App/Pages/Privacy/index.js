import React from 'react';
import {Helmet} from 'react-helmet';
import PrivacyContent from './PrivacyContent';

export default class Support extends React.Component {

    goBack = () => {
        this.props.history.goBack();
    };

    render(){
        return(
            <>
                <Helmet>
                    <title>Privacy Policy - Original Crash Game</title>
                </Helmet>
                <div  className={'card p-2 mb-2'}>
                    <div className="m-auto text-center">
                        <h2 className={'text-center mb-2 pb-1 hdr flex'}>
                            <span onClick={this.goBack} className="cpt hvw" title="go back">
                                <i className="fa fa-chevron-left font-20 aligdsn-top ml-3 mr-2 mt-1" />
                            </span>
                            <span className="flex-1"><span className="linear-cl">Privacy Policy</span></span>
                        </h2>
                        <div className="text-left card-auto">
                            <PrivacyContent />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}