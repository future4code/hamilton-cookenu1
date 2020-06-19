import { ServerDataBase } from "./ServerDataBase";

export class FollowDatabase extends ServerDataBase {
  private static TABLE_NAME = "followers_cookenu";

  public async followUser(id_following: string, id_follower: string) {
    await this.getConnection()
      .insert({ id_follower, id_following })
      .into(FollowDatabase.TABLE_NAME);
  }

  public async unfollowUser(id_following: string, id_follower: string) {
    await this.getConnection().delete().where({ id_follower, id_following });
  }
}