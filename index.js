const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({path: "./.env"})
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(express.json());

mongoose.connect(process.env.DB_URI)
.then(result => console.log("Connected to the database successfully!"))
.catch(err => console.log(err));

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

app.use("/api", productRoutes);
app.use("/api", authRoutes);

app.use((error, req, res, next) => {
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})

app.listen(process.env.PORT, (err)=>{
        if(!err){
            console.log(`Server is running here: http://localhost:${process.env.PORT}`);
        }else{
            console.log(err);
        }
});