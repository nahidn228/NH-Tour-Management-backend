/* eslint-disable no-console */
import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://express:express11111@cluster0.dssil.mongodb.net/NH-TourManagement?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to DB");

    server = app.listen(5000, () => {
      console.log("server is listening on port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection Detected... Server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});


process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception Detected... Server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log("SIGTERM Signal Received... Server shutting down", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
