import BottomNav from "../components/BottomNavigation";
import NotesComponent from "../components/Notes";
import parseCookie from "../utils/parseCookie";
import {decode} from "jsonwebtoken";
import {myGet} from "../utils/myGet";
import {axiosVar} from "../utils/axiosVar";
import {sortedArr} from "../utils/sortArr";
import {useContext, useEffect, useState} from "react";
import {Context} from "../utils/reducer/reducer";
import axios from "axios";

export default function Notes({notes}){

    const [state,dispatch] = useContext(Context)

    const type = state.type.split(' ');

    const [note,setNote]=useState(notes)


    useEffect(()=>{
        const email = state.email!==undefined&&state.email!==''?state.email:localStorage.getItem('email')
        axios.get(`${axiosVar}api/notes?email=${email}`).then(data=> {
            setNote(data.data)
        })
    },[])


    return(
        <BottomNav>
            <NotesComponent notes={note} type={type}/>
        </BottomNav>
    )
}


Notes.getInitialProps = async (ctx) => {

    const cookieProps = parseCookie(ctx.req).auth
    const cookieEmail = cookieProps?decode(cookieProps).email:''

    ctx.query={
        email: cookieEmail===''?ctx.query.email:cookieEmail
    }

    const json = await myGet(`${axiosVar}api/notes?email=${ctx.query.email}`,ctx);

    console.log(json)
    return{
        notes:json
    }
}
