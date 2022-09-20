import dayjs from "dayjs"




export const getRemainingTime=(timestamp)=>{
    //lets create a dayjs variable
  

    const timestampDayjs=dayjs(timestamp);
    const nowDayjs=dayjs();

    return{
        seconds:getRemainingSeconds(nowDayjs,timestampDayjs),
        minutes:getRemainingMinutes(nowDayjs,timestampDayjs),
        hours:getRemainingHours(nowDayjs,timestampDayjs),
        days:getRemainingDays(nowDayjs,timestampDayjs)
    }
}

    //receives the now timestamp and the future timestamp
    const getRemainingSeconds=(nowDayjs,timestampDayjs)=>{
        const seconds=timestampDayjs.diff(nowDayjs,'seconds') % 60
        return padWithZeros(seconds,2);

    }
    const getRemainingMinutes=(nowDayjs,timestampDayjs)=>{
        const minutes=timestampDayjs.diff(nowDayjs,'minutes') % 60
        return padWithZeros(minutes,2)
    }
    const getRemainingHours=(nowDayjs,timestampDayjs)=>{
        const hours=timestampDayjs.diff(nowDayjs,'hours') % 24
        return padWithZeros(hours,2)
    }
    const getRemainingDays=(nowDayjs,timestampDayjs)=>{
        const days=timestampDayjs.diff(nowDayjs,'days') 
        return days.toString
    }

    const padWithZeros=(number,minLength)=>{
        const numberString=number.toString();
        if(numberString.length>=minLength)return numberString
        return "0".repeat(minLength-numberString.length)+numberString
    }