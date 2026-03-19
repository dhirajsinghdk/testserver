import { Response } from "express";
import {ZodError} from "zod"
import mongoose from "mongoose";

interface ResponseData {
    success:boolean;
    message:string;
    data?:any;
    error?:any;
}

interface ErrorDetails{
    field?:string;
    message:string
}

const formatResponse=(
    res:Response,
    statusCode:number,
    success:boolean,
    message:string,
    data?:any
):void=>{
    const responseData:ResponseData={
        success,
        message
    }
    let status= statusCode;
    if (data) {
        if (success){
            responseData.data = data;
        } else {
            if (data instanceof ZodError){
                responseData.message= "Validation Error";
                status= 400;
            }else if (data instanceof mongoose.Error.ValidationError){
                responseData.message = "Validation from mongoose..."
                status=400
            }else if(data.code === 11000){
                status=400
            }
            responseData.error= formatErrors(data)
            if (status === 500){
                console.error(data);

                if (process.env.NODE_ENV === "production"){
                    responseData.error= "Unknown error occured ..."
                }
            }
        }
    }

res.status(status).json(responseData)
}

const formatErrors=(error:any): ErrorDetails[]=>{
    if (error instanceof ZodError){
        return error.issues.map((issue)=>(
            {
                field:issue.path.join("."),
                message:issue.message
            }
        ))
    }
    if (error.code === 11000){
        return[{
            message:"Duplicate entry not allowed..." +JSON.stringify(error.keyValue)
        }]
    }
    if (error instanceof Error){
        return[{message:error.message}]
    }
    return[{message:"An error occured ..."}]
}

export {
    formatResponse,
    ErrorDetails,
    ResponseData
}