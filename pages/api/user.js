import Login from '../../models/Login'
import Note from '../../models/Note'
import {auth} from "../../utils/authMiddleware";



export default auth(async function login (req,res){


    switch (req.method){
        case "GET":
        {
            const {email} = req.query

            const user = await Login.findOne({email:email})

            const notes = await Note.find({createdBy:email})


            const UserInfo = {user,notes:notes}

           return res.status(200).json({data:UserInfo})
        }

        case "POST":
        {
            const {email,mode} = req.body

            const user = await Login.findOneAndUpdate({email:email},{Darkmode:!mode},{
                new:true,
                runValidators:true
            })

          return res.status(200).json({data:user})
        }

        default:
          return res.status(404).json({error:true})
    }



})