"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FollowDatabase_1 = require("../data/FollowDatabase");
const ServerDataBase_1 = require("../data/ServerDataBase");
const UserDataBase_1 = require("../data/UserDataBase");
const Authenticator_1 = require("../services/Authenticator");
const CustomError_1 = require("../Util/CustomError");
const express_1 = require("express");
const RecipeDataBase_1 = require("../data/RecipeDataBase");
const getProfileEndingPoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const token = request.headers.authorization;
    const userInfo = new Authenticator_1.Authenticator().getData(token);
    const userProfile = yield new UserDataBase_1.UserDatabase().getUserById(userInfo.id);
    response.status(200).send({
        id: userProfile.id,
        email: userProfile.email,
    });
    yield ServerDataBase_1.ServerDataBase.destroyConnection();
});
const getOtherUserProfileEndpoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    const token = request.headers.authorization;
    new Authenticator_1.Authenticator().getData(token);
    const userProfile = yield new UserDataBase_1.UserDatabase().getUserById(id);
    if (!userProfile)
        throw new CustomError_1.CustomError("User does not exist", 400);
    response.json(userProfile);
    yield ServerDataBase_1.ServerDataBase.destroyConnection();
});
const followUserEndpoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userToFollowId } = request.body;
    const token = request.headers.authorization;
    if (!userToFollowId)
        throw new CustomError_1.CustomError("Invalid or missing 'userToUnfollowId' ", 400);
    if (!(yield new UserDataBase_1.UserDatabase().getUserById(userToFollowId)))
        throw new CustomError_1.CustomError("Invalid 'userToUnfollowId'", 400);
    const userInfo = new Authenticator_1.Authenticator().getData(token);
    yield new FollowDatabase_1.FollowDatabase().followUser(userToFollowId, userInfo.id);
    response.json({
        message: "Followed successfully",
    });
    yield ServerDataBase_1.ServerDataBase.destroyConnection();
});
const unfollowUserEndpoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userToUnfollowId } = request.body;
    const token = request.headers.authorization;
    if (!userToUnfollowId)
        throw new CustomError_1.CustomError("Invalid or missing 'userToUnfollowId' ", 400);
    if (!(yield new UserDataBase_1.UserDatabase().getUserById(userToUnfollowId)))
        throw new CustomError_1.CustomError("Invalid 'userToUnfollowId'", 400);
    const userInfo = new Authenticator_1.Authenticator().getData(token);
    yield new FollowDatabase_1.FollowDatabase().unfollowUser(userToUnfollowId, userInfo.id);
    response.json({
        message: "Unfollowed successfully",
    });
    yield ServerDataBase_1.ServerDataBase.destroyConnection();
});
const getFeeedEndpoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const token = request.headers.authorization;
    const userInfo = new Authenticator_1.Authenticator().getData(token);
    const followingUsers = yield new FollowDatabase_1.FollowDatabase().getFollowing(userInfo.id);
    const recipeDatabase = new RecipeDataBase_1.RecipeDataBase();
    const recipes = [];
    for (let i = 0; i < followingUsers.length; i++) {
        recipes.push(yield recipeDatabase.getRecipesByUserId(followingUsers[i].id_following));
    }
    response.status(200).send(recipes);
});
const userRoute = express_1.Router();
userRoute.get("/profile", getProfileEndingPoint);
userRoute.get("/feed", getFeeedEndpoint);
userRoute.get("/:id", getOtherUserProfileEndpoint);
userRoute.post("/follow", followUserEndpoint);
userRoute.post("/unfollow", unfollowUserEndpoint);
exports.default = userRoute;
