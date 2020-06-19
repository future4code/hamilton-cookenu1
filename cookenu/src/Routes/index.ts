import { Router } from "express";
import { loginEndingPoint } from "./login.routes";
import recipeRoute from "./recipe.routes";
import { signUpEndingPoint } from "./signup.routes";
import userRoute from "./user.routes";
import { renewRefreshTokenEndpoint } from "./refreshtoken.routes";

const routes = Router();

routes.get("/refreshtoken", renewRefreshTokenEndpoint);
routes.post("/signup", signUpEndingPoint);
routes.post("/login", loginEndingPoint);
routes.use("/recipe", recipeRoute);
routes.use("/user", userRoute);

export default routes;
