import mongoose, { Connection } from "mongoose";
import { vars } from "../const/vars";

const { mongo, env } = vars;

const RECONNECT_TIMEOUT = 15000;

mongoose.Promise = Promise;

if (env === "development") {
  mongoose.set("debug", true);
}

async function connect(): Promise<Connection> {
  await mongoose.connect(mongo.url);
  const { connection } = mongoose;
  return connection;
}

mongoose.connection.on("error", (err) => {
  setTimeout(connect, RECONNECT_TIMEOUT);
});

export default {
  connect,
};
