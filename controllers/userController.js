import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import validator from 'validator';

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//function for registering users
const registerUser = async (req, res) => {
    try {
        const {name, email, password, categories} = req.body;
        const emailExist = await User.findOne({email})
        if (emailExist) {
            res.json({success:false, message:"Email already registered"})
        }

        //validating email and strong password
        if (!validator.isEmail(email)) {
            res.json({success:false, message:"Invalid Email"})
        }

        //pasword validation here
        if (password.length < 8) {
            res.json({success:false, message:"Password should be than 8 characters"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User({
            name, 
            email,
            password:hashedPassword,
            categories
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true, message:"User Registeration Successifully", token})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//function for logging in users
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})

        if(!user) {
            res.json({success:false, message:"User does not exist"})
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (passwordMatch) {
            const token = createToken(user._id)
            res.json({success:true, message:"User logged in successifully", token, name:user.name, categories: user.categories})
        } else {
            res.json({success:false, message:"Invalid credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

const userProfile = async (req, res) => {
    try {
        if (!req.user) {
            return res.json({ success: false, message: "User not authenticated" });
        }
        console.log("User object:", req.user);

      const allowedUpdates = ['categories', 'skills','institution', 'degree', 'experience', 'bio', 'occupation'];
      const updates = Object.keys(req.body)
        .filter(key => allowedUpdates.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});
  
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true }
      ).select('-password');
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
      res.json({success:true, message:"successifull", user});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
};

//fetching user data
const getUserData = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ msg: 'User not found' });
      res.json({
        username: user.username,
        email: user.email,
        categories: user.categories,
        skills: user.skills || [],
        experience: user.experience || 0,
        bio: user.bio || '',
        institution: user.institution || '',
        degree: user.degree || '',
        occupation: user.occupation || ''
      });
    } catch (err) {
      console.error('Profile route error:', err.message);
      res.status(500).json({ msg: 'Server error' });
    }
};

//function for logging in admin
const adminLogin = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({success:true, message:"Logged in succesifully", token})
        } else {
            res.json({success: false, message:"Invalid credentials"});
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

export {
    registerUser,
    loginUser,
    adminLogin,
    userProfile,
    getUserData
}