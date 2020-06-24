import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { CustomError } from "../Util/CustomError";
import { UserDatabase } from "../data/UserDataBase";
import { ServerDataBase } from "../data/ServerDataBase";
import { RefreshTokenDataBase } from "../data/RefreshTokenDataBase";

export const renewRefreshTokenEndpoint = async (
  request: Request,
  response: Response
) => {
  const { refreshToken, device } = request.body;

  const authenticator = new Authenticator();
  const userData = await new RefreshTokenDataBase().getRefreshToken(
    refreshToken
  );

  if (userData.device !== device) {
    throw new CustomError("Logue novamente!", 412);
  }

  const user = await new UserDatabase().getUserById(userData.id);

  if (!user) throw new CustomError("User does not exist", 400);

  const newAccessToken = authenticator.generateToken({
    id: user.id,
    role: user.role,
  });

  response.status(200).send({
    "acces token": newAccessToken,
  });

  await ServerDataBase.destroyConnection();
};
