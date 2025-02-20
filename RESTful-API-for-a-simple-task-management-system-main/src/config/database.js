const mongoose = require("mongoose")

const dotenv = require('dotenv');

dotenv.config();

const connectDB = async()=>{
  
   try{
      
    const database = await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully');


   }catch(error){
        console.log("Error connecting to database", error.message)
   }
}



module.exports = connectDB;
