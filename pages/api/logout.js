import dbConnect from "../../utils/dbConnect";
import {auth} from "../../utils/authMiddleware";

dbConnect();

export default auth(async function LogOut(req,res)
{
 if(req.cookies['auth']!=='deleted'&&req.cookies['auth']!==undefined){
  res.setHeader(
      "Set-Cookie",
      "auth=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  )
  return res.status(201).json({message:'Good Bye!'})
 }

  res.status(400).json({message:'not logged'})


})

