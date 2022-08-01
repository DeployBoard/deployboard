import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import mongoose from "mongoose";

import "./utils/db";
import schema from "./schemas";
import { isAuth, authenticateToken, verifyToken } from "./middleware/auth";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(verifyToken);
// app.use(isAuth);
// app.use(authenticateToken);
const httpServer = http.createServer(app);

const server = new ApolloServer({
  schema,
  cors: true,
  csrfPrevention: true,
  playground: process.env.NODE_ENV === "development" ? true : false,
  introspection: true,
  tracing: true,
  path: "/",
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  context: ({ req, res }) => {
    try {
      const token = req.token;
      console.log(token);
      if (!token) {
        return { user: null, account: null };
      }
      const decodedToken = jwt.verify(
        token.split(" ")[1],
        process.env.ACCESS_TOKEN_SECRET
      );
      return { email: decodedToken.email, account: decodedToken.account };
    } catch {
      return { user: null, account: null };
    }
  },
});

server.start().then((res) => {
  server.applyMiddleware({
    app,
    path: "/",
    cors: true,
    onHealthCheck: () =>
      // eslint-disable-next-line no-undef
      new Promise((resolve, reject) => {
        if (mongoose.connection.readyState > 0) {
          resolve();
        } else {
          reject();
        }
      }),
  });

  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
  });
});
