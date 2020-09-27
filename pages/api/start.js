import dbConnect from "../../utils/dbConnect";
import Login from '../../models/Login'

dbConnect()

export default async function Start(req,res)
{
    if(req.method==='GET'){
        const temp = await Login.findOne({})
     return   res.status(201).json({data:'ready'})
    }

   return res.status(200).json({data:'ready'})


}