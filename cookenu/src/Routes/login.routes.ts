import { Request, Response } from "express";
import { RefreshTokenDataBase } from "../data/RefreshTokenDataBase";
import { UserDatabase } from "../data/UserDataBase";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { CustomError } from "../Util/CustomError";
import validateEmail from "../Util/emailValidate";
import { validatePassword } from "../Util/validatePassword";
import { ServerDataBase } from "../data/ServerDataBase";

export const loginEndingPoint = async (
  request: Request,
  response: Response
) => {
  const { email, password } = request.body;

  const isEmail = validateEmail(email);
  if (!isEmail) {
    throw new CustomError("Email inválido.", 412);
  }

  const isPassword = validatePassword(password);
  if (!isPassword) {
    throw new CustomError("Formato de senha incorreto!", 412);
  }

  const user = await new UserDatabase().getUserByEmail(email);
  if (!user) {
    throw new CustomError("Email ou senha incorreta!", 412);
  }

  const hashCompare = await new HashManager().compare(password, user.password);
  if (!hashCompare) {
    throw new CustomError("Email ou senha incorreta!", 412);
  }

  if (user.role !== "normal" && user.role !== "admin") {
    throw new CustomError(
      "O usuário só pode ser do tipo normal ou admin!",
      412
    );
  }

  const authenticator = new Authenticator();
  const accessToken = authenticator.generateToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = authenticator.generateToken(
    {
      id: user.id,
      device: user.device,
    },
    "1y"
  );

  const refreshTokenDataBase = new RefreshTokenDataBase();
  await refreshTokenDataBase.storeRefreshToken(
    refreshToken,
    user.device,
    true,
    user.id
  );
  const retrievedRefreshToken = await refreshTokenDataBase.getRefreshTokenByIdAndDevice(
    user.id,
    user.device
  );
  if (retrievedRefreshToken) {
    await refreshTokenDataBase.deleteRefreshToken(retrievedRefreshToken.token);
  }

  response.status(200).send({
    message: `Usuário logado com sucesso!`,
    "access token": accessToken,
    "refresh token": refreshToken,
  });

  await ServerDataBase.destroyConnection();
};
