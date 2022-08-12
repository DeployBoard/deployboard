import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongo_uri =
  process.env.MONGO_URI || "mongodb://localhost:27017/deployboard";

mongoose.Promise = global.Promise;

const connection = mongoose.connect(mongo_uri, {
  autoIndex: true,
  keepAlive: false,
  useNewUrlParser: true,
});

// mongoose.set("useCreateIndex", true);

connection
  .then(() => {
    console.log(`Connected to MongoDB at ${mongo_uri}`);
  })
  .catch((err) => {
    console.log(err);
  });

export default connection;
