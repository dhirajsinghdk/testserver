import mongoose from "mongoose"

const DatabaseUrl = process.env.MONGO_URL || ""

 const dbConnect = async()=>{
    try{
        if(!DatabaseUrl){
            console.log("Database connection string is required")
        }
        await mongoose.connect(DatabaseUrl, {})
        console.log("Connected to database successfully")

    }
    catch(error){
        console.log("Error connecting database", error)
    }
}

export default dbConnect