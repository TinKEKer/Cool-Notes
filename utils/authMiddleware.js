import {verify} from "jsonwebtoken";
import {secret} from "./secret";



export const auth = (fn=>async(req,res)=>{
    console.log(req.cookies.confirmation)
    verify(req.cookies.auth||req.cookies.confirmation,secret,async function (err,decoded) {
        if(!err&&decoded){
            return await fn(req,res);
        }
        res.status(401).json({message:'sorry not logged'})
    })

})