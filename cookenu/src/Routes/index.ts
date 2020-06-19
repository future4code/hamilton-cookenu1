import { Router } from "express";
import { loginEndingPoint } from "./login.routes";
import recipeRoute from "./recipe.routes";
import { signUpEndingPoint } from "./signup.routes";
import userRoute from "./user.routes";

const routes = Router();

routes.post("/signup", signUpEndingPoint);
routes.post("/login", loginEndingPoint);
routes.use("/recipe", recipeRoute);
routes.use("/user", userRoute);

export default routes;
