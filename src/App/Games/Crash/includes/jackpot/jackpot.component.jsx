import React from "react"
import "./jackpot.styles.css"

const JackPot=()=>{
    return(
        <div className="jackpot-container">
            <span className="jackpot-title">HOW TO PLAY THE CORRECT PREDICTION JACKPOT</span>
            <p className="jackpot-description">Every time you place a bet and the game busts at the Cashout multiplier you had set, you
                win <span>KSH.100,000</span> in addition to your winings. E.g. if you stake Ksh.10 and you put a cashout multiplier 
                of 23.4X and the game stops at 23.4X, you win the KSH.234 plus Ksh.100,000
            </p>

            <span className="jackpot-title">HOW TO PLAY THE DRAW JACKPOT</span>
            <p className="jackpot-description">Every time you place a bet with Shinda247 and you lose your bet, you still have a chance to win <span>KSH. 50,000</span> in the daily draw. 
                Every lost bet ID has one entry in the draw per day 
            </p>


        </div>
    )
}

export default JackPot