import { Types } from "mongoose";
import { Request } from "express";

 interface AuthenticatedRequest extends Request {
  user?: Partial<IUser>;
}

interface IUser {
    fullName:string;
    contact:number;
    email:string;
    password:string;
}

export {
    IUser,
    AuthenticatedRequest
}