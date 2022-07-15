import React from "react";
import ReactTooltip from "react-tooltip";

export default class Social extends React.Component {
    render(){
        const { t } = this.props;
        return(
            <>
                <span className="btn-social-icon">
                    <ReactTooltip />
                    <a href={t('facebook')} target={'_blank'} rel={'noopener noreferrer'} data-tip={'FaceBook Page'}>
                        <i className={'mdi mdi-facebook font-25'} style={{ color: 'rgb(21 100 203)' }} />
                    </a>
                    <a href={t('twitter')} target={'_blank'} rel={'noopener noreferrer'} data-tip={'Twitter News'}>
                        <i className={'mdi mdi-twitter font-25'} style={{ color: 'rgb(21 169 244)' }} />
                    </a>
                    <a href={t('instagram')} target={'_blank'} rel={'noopener noreferrer'} data-tip={'Instagram Page'}>
                        <i className={'mdi mdi-instagram font-25'} style={{ color: 'rgb(244 67 54)' }} />
                    </a>
                </span>
            </>
        );
    }
}