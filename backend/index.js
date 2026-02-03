const express = require("express");
const rootRouter = require("./routes/index");
const UserRouter = require("./routes/user");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());


app.use("/api,v1",rootRouter);
app.use("/api/v1/users",UserRouter);




app.listen(3000,()=>{
    console.log("server started");
})

