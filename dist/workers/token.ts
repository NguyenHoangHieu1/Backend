import { parentPort, workerData } from "worker_threads";
import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    email: workerData.email,
    userId: workerData.userId,
  },
  "reallysecret",
  { expiresIn: "1h" }
);

parentPort?.postMessage(token);
