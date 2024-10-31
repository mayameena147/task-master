const express = require("express");
const userRouter = require("./routes/userRoutes");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const taskRouter = require("./routes/taskRoutes");
const PORT = 3000;

app.use(express.json());
dotenv.config();

app.use('/users', userRouter);
app.use('/tasks', taskRouter);

app.listen(PORT, ()=> {
    console.log("server is listening on PORT: " + PORT);
})

mongoose.connect(process.env.MOONGOOSE_CONNECTION_STRING + process.env.DB_NAME)
.then(
    ()=> {console.log("db conncted")}
    )
.catch((error) => console.log("db not connected" + error));

module.exports = app;