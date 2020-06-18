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
exports.getProfileEndingPoint = void 0;
const Authenticator_1 = require("../services/Authenticator");
const UserDataBase_1 = require("../data/UserDataBase");
const ServerDataBase_1 = require("../data/ServerDataBase");
exports.getProfileEndingPoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const token = request.headers.authorization;
    console.log('token', token);
    const userInfo = yield new Authenticator_1.Authenticator().getData(token);
    console.log('userinfo', token);
    const userProfile = yield new UserDataBase_1.UserDatabase().getUserById(userInfo.id);
    console.log('userpfoiel', token);
    response
        .status(200)
        .send({
        id: userProfile.id,
        email: userProfile.email
    });
    yield ServerDataBase_1.ServerDataBase.destroyConnection();
});
