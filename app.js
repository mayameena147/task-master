const express = require("express");
const http = require("http");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const teamRouter = require("./routes/teamRoutes");
const app = express();
const server = http.createServer(app);
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const PORT = 3000;

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "PUT", "POST"],
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(express.json());
dotenv.config();

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/users', userRouter);
app.use('/tasks', taskRouter);
app.use('/teams', teamRouter);

server.listen(PORT, ()=> {
    console.log("server is listening on PORT: " + PORT);
})

mongoose.connect(process.env.MOONGOOSE_CONNECTION_STRING + process.env.DB_NAME)
.then(
    ()=> {console.log("db conncted")}
    )
.catch((error) => console.log("db not connected" + error));

module.exports = app;