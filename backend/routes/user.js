const express = require("express");
const UserRouter = express.Router();
const zod = require("zod");
const {User} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const {authMiddleware} = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string().min(6)
})
const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
})
const updateBody = zod.object({
    username: zod.string().email().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
    password: zod.string().min(6).optional()
})



UserRouter.post("/signup",async (req,res)=>{
    const {success} = signupBody.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message: "Email alrdeady exists"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            message: "Email already exists"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstname,
        lastName: req.body.lastname
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    res.status(201).json({
        message: "User created succesfully",
        token:token
    })
})
UserRouter.post("/signin",async (req,res)=>{
    const{success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Invalid credentials"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
        res.status(200).json({
            message: "User signed in successfully",
            token: token
        })
    }
})
UserRouter.put("/",authMiddleware,async(req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Invalid credentials"
        })
    }
    await User.updateOne({
        _id: req.userId
    },req.body);
    res.json({
        message: "Updated successfully!"
    })
})
UserRouter.get("/bulk",async(req,res)=>{
    const filter = req.query.filter||"";

    const users = await User.find({
      $or: [
        {
          //matches either condition -> return data
          firstName: {
            $regex: filter, //regex will find the string which matches the filter(required value or given value) in the database
          },
        },
        {
          lastName: {
            $regex: filter,
          }   
        }],
    });
    res.json({
        user: users.map(user=> ({
            username: user.username,
            firstname: user.firstName,
            lastname: user.lastName,
            _id: user._id
        }))
    })
})



module.exports = UserRouter;