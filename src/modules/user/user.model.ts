import mongoose, {Schema, Model} from "mongoose";
import {
IUser
} from "../../interface/user.interface"

const userSchema = new Schema<IUser>({
      fullName:{type:String, required:true},
      contact:{type:Number, required:true},
      email:{type:String, required:true},
      password:{type:String, required:true},
},
{
 timestamps:true
}
)

export const UserModel = mongoose.model<IUser>("user", userSchema)