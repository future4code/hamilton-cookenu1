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
exports.RefreshTokenDataBase = void 0;
const ServerDataBase_1 = require("./ServerDataBase");
class RefreshTokenDataBase extends ServerDataBase_1.ServerDataBase {
    storeRefreshToken(token, device, isActive, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this
                .getConnection()
                .insert({
                refresh_token: token,
                device: device,
                is_active: (Number(isActive) === 1 ? true : false),
                user_id: userId
            })
                .into(RefreshTokenDataBase.TABLE_NAME);
        });
    }
    getRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenInfo = yield this
                .getConnection()
                .select('*')
                .from(RefreshTokenDataBase.TABLE_NAME)
                .where({
                refresh_token: token
            });
            const retrievedToken = tokenInfo[0][0];
            return {
                token: retrievedToken.refresh_token,
                device: retrievedToken.device,
                isActive: (Number(retrievedToken.is_active) === 1 ? true : false),
                userId: retrievedToken.user_id
            };
        });
    }
    getRefreshTokenByIdAndDevice(id, device) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenInfo = yield this
                .getConnection()
                .select('*')
                .from(RefreshTokenDataBase.TABLE_NAME)
                .where({
                user_id: id,
                device: device
            });
            const retrievedToken = tokenInfo[0];
            return {
                token: retrievedToken.refresh_token,
                device: retrievedToken.device,
                isActive: (Number(retrievedToken.is_active) === 1 ? true : false),
                userId: retrievedToken.user_id
            };
        });
    }
    deleteRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this
                .getConnection()
                .del()
                .from(RefreshTokenDataBase.TABLE_NAME)
                .where({ refresh_token: token });
        });
    }
}
exports.RefreshTokenDataBase = RefreshTokenDataBase;
RefreshTokenDataBase.TABLE_NAME = "refresh_token";
