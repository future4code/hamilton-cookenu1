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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginEndingPoint = void 0;
const RefreshTokenDataBase_1 = require("../data/RefreshTokenDataBase");
const UserDataBase_1 = require("../data/UserDataBase");
const Authenticator_1 = require("../services/Authenticator");
const HashManager_1 = require("../services/HashManager");
const CustomError_1 = require("../Util/CustomError");
const emailValidate_1 = __importDefault(require("../Util/emailValidate"));
const validatePassword_1 = require("../Util/validatePassword");
exports.loginEndingPoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const isEmail = emailValidate_1.default(email);
    if (!isEmail) {
        throw new CustomError_1.CustomError("Email inválido.", 412);
    }
    const isPassword = validatePassword_1.validatePassword(password);
    if (!isPassword) {
        throw new CustomError_1.CustomError("Formato de senha incorreto!", 412);
    }
    const user = yield new UserDataBase_1.UserDatabase().getUserByEmail(email);
    if (!user) {
        throw new CustomError_1.CustomError("Email ou senha incorreta!", 412);
    }
    const hashCompare = yield new HashManager_1.HashManager().compare(password, user.password);
    if (!hashCompare) {
        throw new CustomError_1.CustomError("Email ou senha incorreta!", 412);
    }
    if (user.role !== "normal" && user.role !== "admin") {
        throw new CustomError_1.CustomError("O usuário só pode ser do tipo normal ou admin!", 412);
    }
    const authenticator = new Authenticator_1.Authenticator();
    const accessToken = yield authenticator.generateToken({
        id: user.id,
        role: user.role,
    }, "1d");
    const refreshToken = yield authenticator.generateToken({
        id: user.id,
        device: user.device,
    }, "1d");
    const refreshTokenDataBase = new RefreshTokenDataBase_1.RefreshTokenDataBase();
    yield refreshTokenDataBase.storeRefreshToken(refreshToken, user.device, true, user.id);
    const retrievedRefreshToken = yield refreshTokenDataBase.getRefreshTokenByIdAndDevice(user.id, user.device);
    if (retrievedRefreshToken) {
        yield refreshTokenDataBase.deleteRefreshToken(retrievedRefreshToken.token);
    }
    response.status(200).send({
        message: `Usuário logado com sucesso!`,
        "access token": accessToken,
        "refresh token": refreshToken,
    });
});
