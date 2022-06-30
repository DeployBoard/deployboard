import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.Promise = global.Promise;

const connection = mongoose.connect(process.env.MONGO_URI, {
  autoIndex: true,
  keepAlive: true,
  useNewUrlParser: true,
});

// mongoose.set("useCreateIndex", true);

connection
  .then((db) => db)
  .catch((err) => {
    console.log(err);
  });

export default connection;
