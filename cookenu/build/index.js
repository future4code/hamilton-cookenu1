"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const ErrorCatcher_1 = __importDefault(require("./Middlewares/ErrorCatcher"));
const signup_routes_1 = require("./Routes/signup.routes");
const login_routes_1 = require("./Routes/login.routes");
const user_routes_1 = require("./Routes/user.routes");
const recipe_routes_1 = require("./Routes/recipe.routes");
const app = express_1.default();
app.use(express_1.default.json());
app.post("/signup", signup_routes_1.signUpEndingPoint);
app.post("/login", login_routes_1.loginEndingPoint);
app.get("/user/profile", user_routes_1.getProfileEndingPoint);
app.post("/recipe", recipe_routes_1.createRecipeEndingPoint);
app.get("/recipe/:id", recipe_routes_1.getRecipeEndingPoint);
app.use(ErrorCatcher_1.default);
const server = app.listen(process.env.PORT || 3000, () => {
    if (server) {
        const address = server.address();
        console.log(`Server is running in http://localhost:${address.port}`);
    }
    else {
        console.error(`Failure upon starting server.`);
    }
});
