import express from "express";
import "express-async-errors";
import { AddressInfo } from "net";
import errorCatcher from "./Middlewares/ErrorCatcher";
import { signUpEndingPoint } from "./Routes/signup.routes";
import { loginEndingPoint } from "./Routes/login.routes";
import {
  getProfileEndingPoint,
  followUser,
  unfollowUser,
  getOtherUserProfile,
} from "./Routes/user.routes";
import {
  createRecipeEndingPoint,
  getRecipeEndingPoint,
} from "./Routes/recipe.routes";

const app = express();

app.use(express.json());

app.post("/signup", signUpEndingPoint);
app.post("/login", loginEndingPoint);
app.get("/user/profile", getProfileEndingPoint);
app.post("/recipe", createRecipeEndingPoint);
app.get("/recipe/:id", getRecipeEndingPoint);
app.post("/user/follow", followUser);
app.post("/user/unfollow", unfollowUser);
app.get("/user/:id", getOtherUserProfile);

app.use(errorCatcher);

const server = app.listen(process.env.PORT || 3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server is running in http://localhost:${address.port}`);
  } else {
    console.error(`Failure upon starting server.`);
  }
});
