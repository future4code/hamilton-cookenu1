import { ServerDataBase } from "./ServerDataBase";

export class FollowDatabase extends ServerDataBase {
  private static TABLE_NAME = "followers_cookenu";

  public async followUser(id_following: string, id_follower: string) {
    await this.getConnection()
      .insert({ id_follower, id_following })
      .into(FollowDatabase.TABLE_NAME);
  }

  public async unfollowUser(id_following: string, id_follower: string) {
    await this.getConnection()
      .delete()
      .where({ id_follower, id_following })
      .into(FollowDatabase.TABLE_NAME);
  }

  public async getFollowing(id_follower: string) {
    return await this.getConnection()
      .select("*")
      .where({ id_follower })
      .into(FollowDatabase.TABLE_NAME);
  }

  public async deleteAllUserRelations(id: string) {
    await this.getConnection()
      .into(FollowDatabase.TABLE_NAME)
      .delete()
      .where({ id_follower: id })
      .orWhere({ id_following: id });
  }
}
