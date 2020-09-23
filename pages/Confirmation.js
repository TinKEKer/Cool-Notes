import {useRouter} from "next/router";
import {useEffect,useState} from "react";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import {Grid} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import Typography from "@material-ui/core/Typography";
import clsx from 'clsx';
import Link from "next/link";
import {myGet} from "../utils/myGet";
import parseCookie from "../utils/parseCookie";
import {decode} from "jsonwebtoken";
import Button from "@material-ui/core/Button";
import {axiosVar} from "../utils/axiosVar";

const useStyles = makeStyles((theme) => ({
    root: {
        display:"grid",
        textAlign:'center'
    },
    icon:{
        fontSize:'150px',
    },
    iconError:{
        color:'red'
    },
    iconSuccess:{
        color:'green'
    }
}));


export default function Confirmation({info}){

     const [data,setData] = useState(info)
    const router=useRouter();




    const classes = useStyles();

    return(
        <Grid className={classes.root}>
            <Grid>
            <VerifiedUserIcon className={clsx(classes.icon,{
                [classes.iconError]:!data.success,
                [classes.iconSuccess]:data.success
            })} />
            </Grid>
           <Typography variant={"h3"} >
               {data.message}
               {data.success?
               <Grid >
               <Link href={"/signin"}>
                   <Button variant="contained" color="primary" style={{width:'150px'}} >
                       Login
                   </Button>
               </Link>
               </Grid>
                   :null}
           </Typography>
        </Grid>
    )
}


Confirmation.getInitialProps = async ctx =>{

    const cookieProps = parseCookie(ctx.req).auth
    const cookieEmail = cookieProps===undefined?ctx.query.email:decode(cookieProps).email

    const hash = ctx.query.hash?ctx.query.hash:'NaN'



   const data = await myGet(`${axiosVar}api/auth/confirmation?email=${cookieEmail}&hash=${hash}`,ctx)

    return{
        info:data
    }
}