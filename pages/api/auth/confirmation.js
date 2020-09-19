import dbConnect from "../../../utils/dbConnect";
import Login from '../../../models/Login'
import {compare} from "bcrypt";
import {auth} from "../../../utils/authMiddleware";

dbConnect();

export default auth( async function confirmation(req,res){
    const {
        method
    } = req;
    if(method==='GET'){
           let user = await Login.findOne({email:req.query.email});
           if(user&&!user.isVerified){
               if(req.query.hash!=='NaN'){
                   compare(req.query.email,req.query.hash, async function (err,pass) {
                       if(pass){
                           const verif = await Login.findOneAndUpdate({email:req.query.email},{isVerified:true},{
                               new:true
                           })
                          return res.status(200).json({message:'You are verified,now login to Cool Notes',success:true})
                       }
                       if(err){
                           return res.status(203).json({message:"Click Verification Link in Email",success:false})
                       }
                   })
               }
               else {
                   return res.status(203).json({message:'Click Verification Link in Email',success:false})
               }
           }
           if(user&&user.isVerified){
               return res.status(203).json({message:"You are verified,now login to Cool Notes",success:true})
           }




    } else {
        res.status(405).json({message:"Only POST allowed"})
    }

})