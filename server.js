const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 8000;
const app = require("./app");

dotenv.config({ path: "./config.env" });
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

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}...`);
});
