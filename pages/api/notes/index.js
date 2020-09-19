import dbConnect from "../../../utils/dbConnect";
import Note from '../../../models/Note'
import {auth} from "../../../utils/authMiddleware";

dbConnect();

export default auth(async function Notes(req,res){
    const {method} = req;


    switch (method){
        case "GET":
            try{
                const notes = await Note.find({
                    createdBy:req.query.email
                });

                res.status(200).json({success:true,data:notes})

            }catch (e){
                res.status(400).json({success:false})
            }
            break;
        case "POST":
            try{
                const note = await Note.create(req.body);

                res.status(201).json({success:true,data:note})

            }catch (e){
                console.log(e)
                res.status(401).json({success:false,message:'Wrong params were sent'});
            }
            break;

        case "PUT":
            try{
                  console.log(req.body)
                for await (let item of req.body){
                    let a = await Note.findOneAndUpdate({noteId:item.noteId},{
                        liked: item.liked,
                        title:item.title,
                        description:item.description,
                        createdBy:item.createdBy,
                        createdAt: item.createdAt,
                        updatedAt:item.updatedAt,
                        noteId:item.noteId
                    })
                }


                res.status(201).json({success:true,data:'upd'})

            }catch (e){
                console.log(e)
                res.status(401).json({success:false,message:'Wrong params were sent'});
            }
            break;

        default:
            res.status(400).json({success:false});
    }

})