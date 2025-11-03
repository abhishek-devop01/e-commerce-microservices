const mongoose = require('mongoose');



async function connectDB(){
     try{
          mongoose.connect(process.env.MONGO_URI);
          console.log("Payment DB connected");
     }catch(e){
          console.log(e);
          
     }
}

module.exports = connectDB;