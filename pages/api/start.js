import dbConnect from "../../utils/dbConnect";

dbConnect()

export default async function Start(req,res)
{
    if(req.method==='GET'){
     return   res.status(201).json({data:'ready'})
    }

   return res.status(200).json({data:'ready'})


}