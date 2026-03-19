import { UserModel } from "./user.model";
import {IUser, AuthenticatedRequest} from "../../interface/user.interface"
import Logger from "../../middleware/logsHandler"
import {
hashPassword
} from "../../middleware/hashFunction"
import {
formatResponse
} from "../../middleware/responseMessage"
import {
  Request, Response
} from "express"

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const jwtSSHKey= process.env.JWT_SECRET_KEY || ""

const userController={
    create:async(req:Request, res:Response )=>{
        try{
          const {password, ...rest} =req.body as IUser
          const previousUser= await UserModel.findOne({email:rest.email})
          if(previousUser){
            return formatResponse(
              res,
              400,
              false,
              "User with same email already exist"
            )
          }
          const hashedPassword= await hashPassword(password)

          const result= UserModel.create({
            ...rest,
            password:hashedPassword
          })
          formatResponse(
            res,
            201,
            true,
            "User created successfully",
            result
          )
        } 
        catch(error){
            Logger.error("User creation failed:", error)
            return formatResponse(
              res,
              500,
              false,
              "User creation failed",
              error
            )
        }
    },
    getAll:async(req:AuthenticatedRequest, res:Response )=>{
       try{
          const result= await UserModel.find().select('-password')
          formatResponse(
            res,
            200,
            true,
            "User fetched successfully",
            result
          )
       }
       catch(error){
         Logger.error("User fetching failed:", error)
            return formatResponse(
              res,
              500,
              false,
              "User fetching failed",
              error
            )

       }

    },
    getById:async(req:AuthenticatedRequest, res:Response )=>{
         try{
          const result= await UserModel.findById(req.params.id)      
          formatResponse(
            res,
            200,
            true,
            "User fetched successfully",
            result
          )
       }
       catch(error){
         Logger.error("User fetching failed:", error)
            return formatResponse(
              res,
              500,
              false,
              "User fetching failed",
              error
            )

       }
    },
    update:async(req:AuthenticatedRequest, res:Response )=>{
        try{
          const { ...updateData} = req.body as IUser
          const userId =req.params.id;
          const dataExist = await UserModel.findById(userId)

          if (!dataExist){
              formatResponse(
                res,
                404,
                false,
                "Not found"
              )
              return;
          }
          
          const result= await UserModel.findOneAndUpdate(
            dataExist._id,
            updateData,
            {
             new:true
            }
          )
              
          formatResponse(
            res,
            200,
            true,
            "User updated successfully",
            result
          )



       }
       catch(error){
         Logger.error("User updating failed:", error)
            return formatResponse(
              res,
              500,
              false,
              "User updating failed",
              error
            )

       }

    },
    delete:async(req:AuthenticatedRequest, res:Response )=>{
        try{
          const result= await UserModel.findByIdAndDelete(req.params.id)      
          formatResponse(
            res,
            200,
            true,
            "User deleted successfully",
            result
          )
       }
       catch(error){
         Logger.error("User deletion failed:", error)
            return formatResponse(
              res,
              500,
              false,
              "User deletion failed",
              error
            )

       }
    },
    login:async(req:Request, res:Response )=>{
      try{
        const {email, password} =req.body

        if (!email || !password){
           return formatResponse(
              res,
              400,
              false,
              "Email and Password is required"
           )
        }
        const user= await UserModel.findOne({email:email})
        if (!user){
           return formatResponse(
              res,
              400,
              false,
              "User not found"
           )
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword){
           return formatResponse(
              res,
              400,
              false,
              "Invalied Cred ..."
           )
        }
       const token = jwt.sign({
          id:user._id,
          email:user.email,
          fullName:user.fullName,
        },
        jwtSSHKey,
        {expiresIn:"1d"}
      )

       return formatResponse(
              res,
              200,
              true,
              "Login Success",
              {
                token, 
                user:{
                  email:user.email,
                  fullName:user.fullName,
                }

              }
           )
      }
       catch(error){
         Logger.error("Login failed:", error)
            return formatResponse(
              res,
              500,
              false,
              "Login failed",
              error
           )
        }
    
    },
}

export {
  userController
}