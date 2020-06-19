import { IdGenerator } from "../services/IdGenetor";
import { Request, Response } from "express";
import { UserDatabase } from "../data/UserDataBase";
import { HashManager } from "../services/HashManager";
import validateEmail from "../Util/emailValidate";
import { CustomError } from "../Util/CustomError";
import { validatePassword } from "../Util/validatePassword";
import { Authenticator } from "../services/Authenticator";
import { RefreshTokenDataBase } from "../data/RefreshTokenDataBase";
import { ServerDataBase } from "../data/ServerDataBase";

export const signUpEndingPoint = async (
  request: Request,
  response: Response
) => {
  const newId = new IdGenerator().generate();
  const { name, email, password, role, device } = request.body;

  const isEmail = validateEmail(email);
  if (!isEmail) {
    throw new CustomError("Email inválido, parça", 412);
  }

  const isPassword = validatePassword(password);
  if (!isPassword) {
    throw new CustomError("Senha inválida, campeão!", 412);
  }

  if (role !== "normal" && role !== "admin") {
    throw new CustomError(
      "O usuário só pode ser do tipo normal ou admin!",
      412
    );
  }

  const newHash = await new HashManager().createHash(password);

  await new UserDatabase().createUser(
    newId,
    name,
    newHash,
    email,
    role,
    device
  );

  const newAccessToken = new Authenticator().generateToken(
    {
      id: newId,
      role: role,
    },
    "1d"
  );

  const newRefreshToken = new Authenticator().generateToken(
    {
      id: newId,
      device: device,
    },
    process.env.ACCESS_TOKEN_EXPIRES_IN
  );

  await new RefreshTokenDataBase().storeRefreshToken(
    newRefreshToken,
    device,
    true,
    newId
  );

  response.status(200).send({
    message: "Usuário criado com sucesso!",
    newAccessToken,
    newRefreshToken,
  });

  await ServerDataBase.destroyConnection();
};
