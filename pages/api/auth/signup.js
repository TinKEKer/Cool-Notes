import dbConnect from "../../../utils/dbConnect";
import Login from '../../../models/Login'
import {hash} from "bcrypt";
import * as nodemailer from "nodemailer";
import {sign} from "jsonwebtoken";
import {secret} from "../../../utils/secret";
import cookie from "cookie";
let fs = require('fs')
let handlebars = require('handlebars')

dbConnect();


let readHTMLFile = async function (path,callback){
    fs.readFile(path,{encoding:'utf-8'},function (err,html){
        if(err){
            throw err;
            callback(err)
        }
        else {
            callback(null,html)
        }
    })
}

export default  async function signup(req,res){
    const {
        method
    } = req;

   if(method==='POST'){


       const email = await new Promise((resolve, reject) => {
           hash(req.body.email, 10, function(err, hash) {
               if (err) reject(err)
               resolve(hash)
           });
       })


       hash(req.body.password,10,async function (err,hash) {
           if (!err) {

               const claims =  {email:req.body.email,emailHash:email}
               const jwt = sign(claims,secret,{expiresIn:'1h'})
               Login.create({
                   firstName: req.body.firstName,
                   lastName: req.body.lastName,
                   email: req.body.email,
                   password: hash
               }).then(data => {

                   let transporter = nodemailer.createTransport({
                       service: 'gmail',
                       auth: {
                           user: process.env.UserMail,
                           pass: process.env.UserPassword
                       }
                   });

                   readHTMLFile('../public/emailTemplate.html',function (err,html){
                       let template = handlebars.compile(html);
                       let replacements = {
                           link:`http://${req.headers.host}/Confirmation?email=${req.body.email}&hash=${email}`
                       }
                       let htmlToSend = template(replacements);

                       let mailOptions = {
                           from: 'no-reply@example.com',
                           to: req.body.email,
                           subject: 'Account Verification Link',
                           html:htmlToSend
                           // text: 'Hello ' + req.body.firstName + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/Confirmation?email=' + req.body.email + '&hash=' + email + '\n\nThank You!\n',
                       };
                       transporter.sendMail(mailOptions, function (err) {
                           if (err) {
                               return res.status(500).send({msg: 'Technical Issue!, Please click on resend for verify your Email.'});
                           }
                           res.setHeader('Set-Cookie',cookie.serialize('confirmation',jwt,{
                               httpOnly:true,
                               secure:process.env.NODE_ENV!=='development',
                               sameSite:'lax',
                               maxAge:3600,
                               path:'/'
                           }))
                           res.json({message: 'A verification email has been sent to ' + req.body.email + '. It will be expire after one day.'});
                       })

                   })

               }).catch(e => res.status(401).json({error: true, message: "Seems like user all ready exists"}))

           }
       })

   } else {
       res.status(405).json({message:"Only POST allowed"})
   }
}