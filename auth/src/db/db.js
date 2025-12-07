const mongoose = require('mongoose')



async function connectDB(){
     try{
          await mongoose.connect(process.env.MONGO_URI)
          console.log("DB is connected");
          
     }catch(e){
          console.error("DB connection failed:", e)
     }
}

module.exports = connectDB