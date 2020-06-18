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
exports.getRecipeEndingPoint = exports.createRecipeEndingPoint = void 0;
const RecipeDataBase_1 = require("../data/RecipeDataBase");
const Authenticator_1 = require("../services/Authenticator");
const IdGenetor_1 = require("../services/IdGenetor");
const CustomError_1 = require("../Util/CustomError");
exports.createRecipeEndingPoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new IdGenetor_1.IdGenerator().generate();
    const { title, description } = request.body;
    const token = request.headers.authorization;
    const userInfo = yield new Authenticator_1.Authenticator().getData(token);
    yield new RecipeDataBase_1.RecipeDataBase().createRecipe(id, title, description, new Date, userInfo.id);
    response.status(200).send({
        message: `Receita criada com sucesso!`,
    });
});
exports.getRecipeEndingPoint = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    const token = request.headers.authorization;
    const userInfo = yield new Authenticator_1.Authenticator().getData(token);
    const recipe = yield new RecipeDataBase_1.RecipeDataBase().getRecipeById(id);
    console.log(userInfo.id, recipe.user_id);
    if (userInfo.id !== recipe.user_id) {
        throw new CustomError_1.CustomError("Problemas na autenticação!", 401);
    }
    response.status(200).send(recipe);
});
