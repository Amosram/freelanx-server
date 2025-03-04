import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    categories:[String],
    skills:[String],
    occupation: String,
    experience:Number,
    bio: String,
    degree:String,
    institution: String

}, {minimize:false})

const User = mongoose.models.user || mongoose.model('User', userSchema)

export default User;