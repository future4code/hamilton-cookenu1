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
exports.RecipeDataBase = void 0;
const ServerDataBase_1 = require("./ServerDataBase");
class RecipeDataBase extends ServerDataBase_1.ServerDataBase {
    createRecipe(id, title, description, created_at, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getConnection()
                .insert({
                id,
                title,
                description,
                created_at,
                user_id,
            })
                .into(RecipeDataBase.TABLE_NAME);
        });
    }
    getUserBycreated_at(created_at) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getConnection()
                .select("*")
                .from(RecipeDataBase.TABLE_NAME)
                .where({ created_at });
            return result[0];
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getConnection()
                .select("*")
                .from(RecipeDataBase.TABLE_NAME)
                .where({ id });
            return result[0];
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getConnection()
                .where({ id: id })
                .del()
                .from(RecipeDataBase.TABLE_NAME);
        });
    }
}
exports.RecipeDataBase = RecipeDataBase;
RecipeDataBase.TABLE_NAME = "recipes_cookenu";
