import React  from "react";
import {Tab, Tabs} from "react-bootstrap";
import ManualBet from './includes/ManualBet';
import AutoBet from './includes/AutoBet';
import {isMobile} from "../../../Helper";
import JackPot from "./includes/jackpot/jackpot.component"
import TimerComponent from "./includes/timer/timer-component"

class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bet: 'manual'
        };
    }

    componentDidMount() {
        if(isMobile()){
            this.setState({ margin: 'mt-1' })
        }
    }

    render() {
        let { margin } = this.state;
        let { token, isLogged, mobile } = this.props;
        return (
            <>
                    <Tabs defaultActiveKey="manual" transition={false} id="crash-tabs" className={'tcr ml-1 mt-1 mb-2 ' + margin}>
                        <Tab eventKey="manual" title="Manual" tabClassName={'btn bg-cs2 btn-xs'}>
                            <ManualBet token={token} mobile={mobile} isLogged={isLogged} />
                        </Tab>
                        <Tab eventKey="auto" title="Auto" tabClassName={'btn bg-cs2 btn-xs'}>
                            <AutoBet isLogged={isLogged} />
                        </Tab>
                        <Tab eventKey="" title="Jackpot" tabClassName={'btn bg-cs2 btn-xs'}>
                            <JackPot/>
                        </Tab>
                    </Tabs>
                    <TimerComponent/>
            </>
        );
    }
}

export default Bet;