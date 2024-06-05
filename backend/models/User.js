const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    admin: {
        type: Boolean,
        default: false,
    },
    role:{
        type: String, 
        enum: {
            values:['student' ,'teacher']
        },
        require: true,
    },
    vnu_id: {
        type: String,
        require: true,
        unique: true,
    },
    gender:{type: String,
        enum: {
            values:['male', 'female']
        },
        require: true,
    },
    phonenumber:{
        type:String,
        require: false,
        default:false
    }
    
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
