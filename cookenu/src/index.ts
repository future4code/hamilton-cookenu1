import express from "express";
import "express-async-errors";
import { AddressInfo } from "net";
import errorCatcher from "./Middlewares/ErrorCatcher";
import {
  signUpEndingPoint
} from "./Routes/signup.routes"
import { loginEndingPoint } from "./Routes/login.routes";
import { getProfileEndingPoint } from "./Routes/user.routes"

const app = express();

app.use(express.json());

app.post("/signup", signUpEndingPoint)

app.post("/login", loginEndingPoint)

app.get("/user/profile", getProfileEndingPoint)

app.use(errorCatcher);

const server = app.listen(process.env.PORT || 3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});