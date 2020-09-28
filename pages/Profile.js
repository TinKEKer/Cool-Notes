import React, {useContext, useEffect, useState} from "react";
import {Context} from "../utils/reducer/reducer";
import parseCookie from "../utils/parseCookie";
import {decode} from "jsonwebtoken";
import {myGet} from "../utils/myGet";
import ProfileComponent from "../components/ProfileComponent";
import {Grid} from "@material-ui/core";
import  axios from "axios";
import {axiosVar} from "../utils/axiosVar";
export default function Profile({data}){

    const [user,setUser] = useState(data)

    const [state,dispatch] = useContext(Context)

    useEffect(()=>{
        axios.get(`${axiosVar}api/user?email=${localStorage.getItem('email')}`).then(data=>{
            setUser(data.data)
        })
    },[state.darkMode])

    return(
        <Grid style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <ProfileComponent data={user.data}/>
        </Grid>
    )
}

Profile.getInitialProps = async (ctx) => {

    const cookieProps = parseCookie(ctx.req).auth
    const cookieEmail = cookieProps?decode(cookieProps).email:''

    ctx.query={
        email: cookieEmail===''?localStorage.getItem('email'):cookieEmail
    }
    const json = await myGet(`${axiosVar}api/user?email=${ctx.query.email}`,ctx);

    return{
        data:json
    }
}