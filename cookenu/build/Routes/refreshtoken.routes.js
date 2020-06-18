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
const Authenticator_1 = require("../services/Authenticator");
const CustomError_1 = require("../Util/CustomError");
const UserDataBase_1 = require("../data/UserDataBase");
const ServerDataBase_1 = require("../data/ServerDataBase");
const renewRefreshToken = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken, device } = request.body;
    const authenticator = new Authenticator_1.Authenticator();
    const userData = yield authenticator.getData(refreshToken);
    if (userData.device !== device) {
        throw new CustomError_1.CustomError("Logue novamente!", 412);
    }
    const user = yield new UserDataBase_1.UserDatabase().getUserById(userData.id);
    const newAccessToken = yield authenticator.generateToken({
        id: user.id,
        role: user.role
    });
    response.status(200).send({
        "acces token": newAccessToken
    });
    yield ServerDataBase_1.ServerDataBase.destroyConnection();
});
