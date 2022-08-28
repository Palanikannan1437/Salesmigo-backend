const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 8000;
const { createServer } = require("http");
const { Server } = require("socket.io");

//for handling any uncaught exceptions from my side
process.on("uncaughtException", (err) => {
  console.log(`UNCAUGHT EXCEPTION! 💥 Shutting down...`);
  console.log(err.name, err.message);
  process.exit(1);
});

//initializing environment variables
dotenv.config({ path: "./.env" });

const app = require("./src/app.js");
const httpServer = createServer(app);

//connecting to our database
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(console.log("DB Connection Successful"));

//initializing socket instance and configuring cors
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
  },
});

//handling all socket requestion
app.use(require("./src/controllers/SocketArchitecture/Websockets")(io));

//we start listening to incoming requests
httpServer.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

//for any errors outside express
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION! 💥 Shutting down...`);
  httpServer.close(() => {
    process.exit(1);
  });
});

//for heroku shutdowns
process.on("SIGTERM", () => {
  console.log(`SIGTERM FROM HEROKU RECEIVED!  Shutting down gracefully...`);
  httpServer.close(() => {
    console.log(`💥 Process terminated`);
  });
});
