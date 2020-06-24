import { ServerDataBase } from "./ServerDataBase";

export class RefreshTokenDataBase extends ServerDataBase {
  private static TABLE_NAME = "refresh_token";

  public async storeRefreshToken(
    token: string,
    device: string,
    isActive: boolean,
    userId: string
  ): Promise<void> {
    await this.getConnection()
      .insert({
        refresh_token: token,
        device: device,
        is_active: Number(isActive) === 1 ? true : false,
        user_id: userId,
      })
      .into(RefreshTokenDataBase.TABLE_NAME);
  }

  public async getRefreshToken(token: string): Promise<any> {
    const tokenInfo = await this.getConnection()
      .select("*")
      .from(RefreshTokenDataBase.TABLE_NAME)
      .where({
        refresh_token: token,
      });

    const retrievedToken = tokenInfo[0][0];

    return {
      token: retrievedToken.refresh_token,
      device: retrievedToken.device,
      isActive: Number(retrievedToken.is_active) === 1 ? true : false,
      userId: retrievedToken.user_id,
    };
  }

  public async getRefreshTokenByIdAndDevice(
    id: string,
    device: string
  ): Promise<any> {
    const tokenInfo = await this.getConnection()
      .select("*")
      .from(RefreshTokenDataBase.TABLE_NAME)
      .where({
        user_id: id,
        device: device,
      });

    const retrievedToken = tokenInfo[0];

    return {
      token: retrievedToken.refresh_token,
      device: retrievedToken.device,
      isActive: Number(retrievedToken.is_active) === 1 ? true : false,
      userId: retrievedToken.user_id,
    };
  }

  public async deleteRefreshToken(token: string) {
    await this.getConnection()
      .del()
      .from(RefreshTokenDataBase.TABLE_NAME)
      .where({ refresh_token: token });
  }

  public async deleteUserRefreshToken(user_id: string) {
    await this.getConnection()
      .delete()
      .where({ user_id })
      .into(RefreshTokenDataBase.TABLE_NAME);
  }
}
