import dbConnect from "../../utils/dbConnect";

dbConnect();

export default async function Start(req,res)
{
    if(req.method==='GET'){
        res.status(201).json({data:'ready'})
    }

    res.status(200).json({data:'ready'})


}