const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email :{
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password : {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
         validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    isAdmin :{
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);

module.exports = mongoose.model('User', UserSchema);