import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGO_URI, {
  autoIndex: true,
  keepAlive: false,
  useNewUrlParser: true,
});

// mongoose.set("useCreateIndex", true);

connection
  .then((db) => {
    console.log(`Connected to MongoDB at ${process.env.MONGO_URI}`);
    db;
  })
  .catch((err) => {
    console.log(err);
  });

export default connection;
