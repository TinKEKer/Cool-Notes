import {sign} from 'jsonwebtoken'
import {compare} from "bcrypt";
import Login from '../../models/Login'
import {secret} from "../../utils/secret";
import cookie from 'cookie'


export default async function login (req,res){

    if(!req.body){
        res.status(404)
    }

    const {email,password} = req.body
    if(req.method==="POST"){

       const user = await Login.findOne({email})

        compare(password,user.password,function (err,result){
            if(!err&&result){
                const claims =  {id:user._id,email:user.email,name:user.firstName}
                const jwt = sign(claims,secret,{expiresIn:'1h'})
                res.setHeader('Set-Cookie',cookie.serialize('auth',jwt,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV!=='development',
                    sameSite:'strict',
                    maxAge:3600,
                    path:'/'
                }))
                res.json({message:`Welcome back ${user.firstName}`,email:user.email,mode:user.Darkmode})
            }else {
                res.status(404).json({success:false})
            }
        })
    }else {
        res.status(404).json({error:true})
    }



}