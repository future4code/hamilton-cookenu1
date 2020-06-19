"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_routes_1 = require("./login.routes");
const recipe_routes_1 = __importDefault(require("./recipe.routes"));
const signup_routes_1 = require("./signup.routes");
const user_routes_1 = __importDefault(require("./user.routes"));
const routes = express_1.Router();
routes.post("/signup", signup_routes_1.signUpEndingPoint);
routes.post("/login", login_routes_1.loginEndingPoint);
routes.use("/recipe", recipe_routes_1.default);
routes.use("/user", user_routes_1.default);
exports.default = routes;
