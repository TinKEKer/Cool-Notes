import dbConnect from "../../../utils/dbConnect";
import Note from '../../../models/Note'
import {auth} from "../../../utils/authMiddleware";

dbConnect();

export default auth( async function Notes(req,res){
    const{
        query:{
            id
        },
        method
    }=req

    switch (method) {
        case "GET":
            try{
                const note = await Note.findById(id)

                if(!note){
                    return res.status(400).json({success:false});
                }

                res.status(200).json({success:true,data:note})

            }catch (e) {
                return res.status(400).json({success:false});
            }
            break;
        case "PUT":
            try{
                const note = await Note.findOneAndUpdate({noteId:id},req.body,{
                    new:true,
                    runValidators:true
                });

                 if(!note){
                     return res.status(400).json({success:false})
                 }
                 res.status(200).json({success:true,data:note})

            }catch (e) {
                console.log(e)
                res.status(400).json({success:false})
            }
             break;

        case "DELETE":
            try{

                const deleteNote = await Note.deleteOne({_id:id});

                if(!deleteNote){
                    res.status(400).json({success:false})
                }

                res.status(200).json({success:true,data:{}})

            }catch (e) {
                res.status(400).json({success:false})
            }
            break;
        default:
            res.status(400).json({success:false})
    }

})