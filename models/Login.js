const mongoose = require('mongoose');


const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        trim: true
    },
    password:{
        type:String,
        required:true,
        minlength:[8,'Password cannot be less than 8 characters']
    },
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    Darkmode:{
        type:Boolean,
        default:false
    }
})



module.exports = mongoose.models.Login || mongoose.model('Login',LoginSchema);