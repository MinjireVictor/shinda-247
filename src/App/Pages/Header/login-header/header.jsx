import Logo from "../../Parts/Logo"
import React from "react"
import { LoginButton,LoginContainer, RegisterButton } from "./header.styles";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { onLoginClicked } from "../../../../actions/login.action";
import { selectIsLoginClicked } from "../../../../selectors/login.selector";
import Login from "../../Auth/Login";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';


const NewHeader=({t, mobile})=>{
    const dispatch=useDispatch();
    const clicked=useSelector(selectIsLoginClicked)
  

    const handleOnClick=(event)=>{
        dispatch(onLoginClicked())
        console.log("CLICKED----- ", clicked)
    }

    return(
        <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            
            {/* {
                clicked&& <Login t={t} mobile={mobile} />
            } */}
           


            <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-around"}}>
                <div style={{marginRight:"4rem",marginLeft:"2rem"}}>
                <Logo/>
                </div>
           
            <div style={{display:"flex", flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
                <span style={{color:"#EDA562", fontSize:"1.1vw"}}>Need Help</span>
                <p style={{color:"white", fontSize:"1.3vw"}}> Call: 0721234567</p>
            </div>
        
            </div>
            <div style={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                <p style={{color:"#EDA562", fontSize:"1.3vw", marginRight:"8px"}}>Winners: </p>
                <p style={{color:"white", fontSize:"1.3vw", marginRight:"8px"}}> Charles 254 - Ksh.38,478</p>
            </div>
           <LoginContainer>
            <LoginButton onClick={handleOnClick}>Login</LoginButton>
            <RegisterButton>Register</RegisterButton>
                 {/* <div style={{padding:"10px 20px", borderRadius:"4px",backgroundColor:"#222E4E",marginRight:"10px",color:"white"}}>Login</div>  */}
                 {/* <div style={{padding:"10px 20px", borderRadius:"4px",backgroundColor:"#EDA562",marginRight:"10px",color:"white"}}>Register</div> */}
           </LoginContainer>
        </div>
    )


}

const LoginPopup=({t,mobile})=>{

    return(
        <Popup trigger={<button> Trigger</button>} position="right center">
       
        </Popup>
    )

}

export default NewHeader


