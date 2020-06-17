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
exports.login = void 0;
const emailValidate_1 = __importDefault(require("../Util/emailValidate"));
const CustomError_1 = require("../Util/CustomError");
const validatePassword_1 = require("../Util/validatePassword");
const UserDataBase_1 = require("../data/UserDataBase");
const Authenticator_1 = require("../services/Authenticator");
exports.login = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const isEmail = emailValidate_1.default(email);
    if (!isEmail) {
        throw new CustomError_1.CustomError("Email inválido, parça", 412);
    }
    const isPassword = validatePassword_1.validatePassword(password);
    if (!isPassword) {
        throw new CustomError_1.CustomError("Senha inválida, campeão!", 412);
    }
    const user = yield new UserDataBase_1.UserDatabase().getUserByEmail(email);
    if (user.role !== "normal" && user.role !== "admin") {
        throw new CustomError_1.CustomError("O usuário só pode ser do tipo normal ou admin!", 412);
    }
    const newToken = yield new Authenticator_1.Authenticator().generateToken({
        id: user.id,
        role: user.role
    });
    response.status(200).send({
        message: "Usuário logado com sucesso!",
        newToken
    });
});
