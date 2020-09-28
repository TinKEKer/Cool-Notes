
const mongoose = require('mongoose');

var autoIncrement = require('mongoose-auto-increment');


autoIncrement.initialize(mongoose.connection)

const schemaOptions = {
    timestamps: true,
};


const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [40, 'Title cannot be more than 40 char']
    },
    description:{
        type:String,
        trim: true,
        required:true,
        maxlength:[200,'Desc cannot be more than 200 char']
    },
    createdBy:{
        type:String,
        required:true
    },
    liked:{
        type:Boolean,
        default:false
    }
},schemaOptions)


NoteSchema.plugin(autoIncrement.plugin,{
    model:"Note",
    field:"noteId",
    startAt:1,
    incrementBy: 1
})

module.exports = mongoose.models.Note || mongoose.model('Note',NoteSchema);

