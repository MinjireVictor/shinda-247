import React  from "react";
import {Tab, Tabs} from "react-bootstrap";
import ManualBet from './includes/ManualBet';
import AutoBet from './includes/AutoBet';
import {isMobile} from "../../../Helper";
import JackPot from "./includes/jackpot/jackpot.component"
import TimerComponent from "./includes/timer/timer-component"
import AllBets from "./AllBets";
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';


class Bet extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bet: 'manual',
            value:0
        };
    }

    handleChangeIndex = (index) => {
        this.setState({value:index})
    };

    componentDidMount() {
        if(isMobile()){
            this.setState({ margin: 'mt-1' })
        }
    }
    a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    


    render() {
        let { margin } = this.state;
        let { token, isLogged, mobile } = this.props;
        let value=this.state.value
        return (
            // <div style={{width:"100%",height:"100%",flexWrap:"wrap", display:"flex", flexDirection:"column"}}>
                
            //     <div>
            //      <Tabs defaultActiveKey="manual" transition={false} id="crash-tabs" className={'tcr ml-1 mt-1 mb-2 ' + margin}>
            //             <Tab eventKey="manual" title="Manual" tabClassName={'btn bg-cs2 btn-xs'}>
            //                 <ManualBet token={token} mobile={mobile} isLogged={isLogged} />
            //             </Tab>
            //             <Tab eventKey="auto" title="Auto" tabClassName={'btn bg-cs2 btn-xs'}>
            //                 <AutoBet isLogged={isLogged} />
            //             </Tab>
            //             <Tab eventKey="" title="Jackpot" tabClassName={'btn bg-cs2 btn-xs'}>
            //                 <JackPot/>
            //             </Tab>
            //         </Tabs> 
             
            //     </div>
            //     <div style={{marginTop:"10px",marginBottom:"10px",display:"flex", justifyContent:"center"}}>
            //     <TimerComponent />
            //     </div>
            //     <div >
            //     <AllBets /> 
            //     </div>
                
            // </div>

            <div style={{width:"100%", overFlow:"hidden"}}>
              
               <div style={{width:"100%", overFlow:"hidden"}}>
                <div style={{display:"flex", flexDirection:"row",justifyContent:"space-between"}}>
                <div onClick={()=>{this.handleChangeIndex(0)}} style={{display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center",flexGrow:"1"}}>
                    <span style={{fontSize:"1.3vw", fontWeight:"bold",color:`${value!==0?`#fff`:`#EDA562`}`,marginBottom:"8px"}}>MANUAL</span>
                <div style={{width:"100px", height:"5px",backgroundColor:`${value!==0?`#00000000`:`#EDA562`}`,color:"#fff", marginLeft:"2px",marginRight:"2px"}}></div>
                </div>
                <div onClick={()=>{this.handleChangeIndex(1)}} style={{display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center",flexGrow:"1"}}>
                <span style={{fontSize:"1.3vw", fontWeight:"bold",color:`${value!==1?`#fff`:`#EDA562`}`,marginBottom:"8px"}}>AUTO</span>
                <div style={{width:"100px", height:"5px",backgroundColor:`${value!==1?`#00000000`:`#EDA562`}`,color:"#fff", marginLeft:"2px",marginRight:"2px"}}></div>
                </div>
                <div onClick={()=>{this.handleChangeIndex(2)}} style={{display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center",flexGrow:"1"}}>
                <span style={{fontSize:"1.3vw", fontWeight:"bold",color:`${value!==2?`#fff`:`#EDA562`}`,marginBottom:"8px"}}>JACKPOT</span>
                <div style={{width:"100px", height:"5px",backgroundColor:`${value!==2?`#00000000`:`#EDA562`}`,color:"#fff", marginLeft:"2px",marginRight:"2px"}}></div>
                </div>
                </div>
                <div>
                    
                </div>
               <SwipeableViews index={value} onChangeIndex={this.handleChangeIndex} animateHeight={true} animateTransitions={true}>
                    <div>
                    <ManualBet token={token} mobile={mobile} isLogged={isLogged} />
                    </div>
                    <div style={{minHeight:"200px"}} >
                    <AutoBet isLogged={isLogged} />
                    </div>
                    <div >
                    <JackPot/>
                    </div>
                </SwipeableViews>

                <div style={{marginTop:"10px",marginBottom:"10px",display:"flex", justifyContent:"center"}}>
                 <TimerComponent />
                </div>
                 <div >
                 <AllBets /> 
                 </div>
               </div>
               
            </div>
        );
    }
}

export default Bet;