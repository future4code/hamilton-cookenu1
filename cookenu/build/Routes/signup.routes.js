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
exports.signUpEndingPoint = void 0;
const IdGenetor_1 = require("../services/IdGenetor");
const UserDataBase_1 = require("../data/UserDataBase");
const HashManager_1 = require("../services/HashManager");
const emailValidate_1 = __importDefault(require("../Util/emailValidate"));
const CustomError_1 = require("../Util/CustomError");
const validatePassword_1 = require("../Util/validatePassword");
const Authenticator_1 = require("../services/Authenticator");
exports.signUpEndingPoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const newId = new IdGenetor_1.IdGenerator().generate();
    const { name, email, password, role } = request.body;
    const isEmail = emailValidate_1.default(email);
    if (!isEmail) {
        throw new CustomError_1.CustomError("Email inválido, parça", 412);
    }
    const isPassword = validatePassword_1.validatePassword(password);
    if (!isPassword) {
        throw new CustomError_1.CustomError("Senha inválida, campeão!", 412);
    }
    const newHash = yield new HashManager_1.HashManager().createHash(password);
    yield new UserDataBase_1.UserDatabase().createUser(newId, name, newHash, email, role);
    const newToken = new Authenticator_1.Authenticator().generateToken({
        id: newId,
        role: role
    });
    response
        .status(200)
        .send({
        message: "Usuário criado com sucesso!",
        newToken
    });
});
