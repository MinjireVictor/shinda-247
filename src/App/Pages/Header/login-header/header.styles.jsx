import styled from "styled-components"
import {Link} from "react-router-dom"


export const LoginButton= styled.div`
background-color:#222E4E;
padding: 16px;
border-radius:4px;
width:auto;
height:auto;
margin:10px;

&:hover {
    cursor:pointer
}

`

export const RegisterButton= styled(Link)`
background-color:#EDA562;
padding:16px;
border-radius:4px;
width:auto;
margin:10px;
color:white;

&:hover {
    cursor:pointer
}

`

export const LoginContainer=styled.div`
display:flex;
flex-direction:row;
align-items:center;
flex-direction:center;
`