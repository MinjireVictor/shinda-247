import React from "react"
import ReactDOM from 'react-dom';
import CountdownTimer from "./custom-timer.component";
import "./timer.styles.css"

const TimerComponent=()=>{
    const ONE_DAY_IN_MS = 1 * 24 * 60 * 60 * 1000;
    const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterOneDay = NOW_IN_MS + ONE_DAY_IN_MS;
    return(
        <div className="timer-container">
        <div className="container-1">
            <span className="txt-shinda" >Shinda</span>
            <span className="txt-jackpot">JACKPOT YETU</span>
        </div>
        <div className="container-2">
            
            <CountdownTimer className="timer"/>
       
        </div>
        </div>
    )
}
export default TimerComponent;
