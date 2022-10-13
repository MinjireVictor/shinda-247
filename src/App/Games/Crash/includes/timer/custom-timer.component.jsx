import React,{useState, useEffect} from "react"
import { getRemainingTime } from "./Utils/countdown-timer.utils"
import dayjs from "dayjs"

import "./countdown-timer.styles.css"

const defaultRemainingTime={
    seconds:"00",
    minutes:"00",
    hours:"00",
    days:"00"
}

const CountDownTimer=()=>{
    const [remainingTime,setRemainingTime]=useState(defaultRemainingTime)
    const{seconds,minutes,hours,days}=remainingTime

    function minutesUntilMidnight() {
        var midnight = new Date();
        midnight.setHours( 24 );
        midnight.setMinutes( 0 );
        midnight.setSeconds( 0 );
        midnight.setMilliseconds( 0 );
        return ( midnight.getTime() - new Date().getTime() ) / 1000 / 60;
    }
  
    const getTimestampTillMidnight=()=>{
       let now= new Date();
       let expiresDateTime=new Date(now.getTime()+minutesUntilMidnight()*60*1000)
       return expiresDateTime

    }
    
    const [receivedTime, setReceivedTime]=useState(getTimestampTillMidnight())

    useEffect(()=>{

        const intervalId=setInterval(()=>{
            let timestampDayjs=dayjs(receivedTime);
            let nowDayjs=dayjs();
            if(timestampDayjs.isBefore(nowDayjs)){
                const time=getTimestampTillMidnight()
                setReceivedTime(time)
                updateRemainingTime(receivedTime)
            }else{
                updateRemainingTime(receivedTime)
            }
        },1000);
        return()=>clearInterval(intervalId)
    },[receivedTime])

    const updateRemainingTime=(countdown)=>{
     setRemainingTime(getRemainingTime(countdown))
        
    }

    return(
        <div className="container" >
            <div>
            <span className="txt-next-draw">Next Draw in:</span>
            </div>
        <div className="countdown-timer">
           <span className="two-numbers">{hours}</span>
           <span> : </span>
           <span  className="two-numbers" >{minutes}</span>
           <span> : </span>
           <span className="two-numbers">{seconds}</span>
          

        </div>


        </div>
    )
}

export default CountDownTimer