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
exports.FollowDatabase = void 0;
const ServerDataBase_1 = require("./ServerDataBase");
class FollowDatabase extends ServerDataBase_1.ServerDataBase {
    followUser(id_following, id_follower) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getConnection()
                .insert({ id_follower, id_following })
                .into(FollowDatabase.TABLE_NAME);
        });
    }
    unfollowUser(id_following, id_follower) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getConnection()
                .delete()
                .where({ id_follower, id_following })
                .into(FollowDatabase.TABLE_NAME);
        });
    }
    getFollowing(id_follower) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getConnection()
                .select("*")
                .where({ id_follower })
                .into(FollowDatabase.TABLE_NAME);
        });
    }
}
exports.FollowDatabase = FollowDatabase;
FollowDatabase.TABLE_NAME = "followers_cookenu";
