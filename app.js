const express = require("express");
const fileupload = require("express-fileupload");
const mongoose = require("mongoose")
const cookieparser = require("cookie-parser")
const cors = require("cors");
const path = require("path");
require("dotenv").config();
 const accountrouter = require("./routers/authrouter")
 const allrouter = require('./routers/generalrouter')
 const userprofile = require("./routers/profilerouter")
  const checkout = require("./routers/checkoutrouter")
  const placeorder = require("./routers/orderrouter")
const app = express();

const port = process.env.PORT;
app.use('/public', express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieparser())
app.use(cors());
app.use(fileupload());
const mydata = process.env.MONGO_URL
mongoose.connect(mydata).then(() => {
    console.log("connected to the database")
}).catch(err => { console.log(err) })

// router middlewares
app.use("/api/v1", accountrouter)
app.use("/api/v1", allrouter)
 app.use("/api/v1", userprofile)
app.use("/api/v1", checkout)
app.use("/api/v1", placeorder)
// error handing in express 
app.use((req,res, next) =>{
     res.status(400).json({message:"Sorry invalid Endpoint"})
})
app.listen(port, () => {
    console.log("running on port" + port)
});