import User from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jdonwebtoken';

const JWT_SECRET ='your_jwt_secret_here';
const TOKEN_EXPIRES = '24h';

const createToken = (userId) =>
    jwt.sign({id:userId},JWT_SECRET, {expiresIn: TOKEN_EXPIRES});

//register a user
export async function registerUser(req,res){
    const {name,email,password}=req.body;
    if (!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"All fields are required."
        });
    }
    if(!validator.isEmail(email)){
        return res.status(400).json({
            success:false,
            message:"password must be atleast of 8 characters."
        })
    }
    try{
        if (await User.findOne({email})){
            return res.status(409).json({
                success:false,
                message:"user already present"
            });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashed});
        const token = createToken(user._id);
        res.status(201).json({
            success: true,
            token,
            user:{id: user._id, name: user.name, email: user.email}
        });
    } 
    catch(err){
        console.error(err);
        res.status(500).json({
            success:false,
            message:"server error"
        });

    }
}