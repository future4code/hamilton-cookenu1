import { Request, Response, request } from "express";
import { FollowDatabase } from "../data/FollowDatabase";
import { ServerDataBase } from "../data/ServerDataBase";
import { UserDatabase } from "../data/UserDataBase";
import { Authenticator } from "../services/Authenticator";
import { CustomError } from "../Util/CustomError";

export const getProfileEndingPoint = async (
  request: Request,
  response: Response
) => {
  const token = request.headers.authorization as string;

  const userInfo = await new Authenticator().getData(token);

  const userProfile = await new UserDatabase().getUserById(userInfo.id);

  response.status(200).send({
    id: userProfile.id,
    email: userProfile.email,
  });

  await ServerDataBase.destroyConnection();
};

export const getOtherUserProfile = async (
  request: Request,
  response: Response
) => {
  const { id } = request.params;
  const token = request.headers.authorization as string;

  new Authenticator().getData(token);

  const userProfile = await new UserDatabase().getUserById(id);

  if (!userProfile) throw new CustomError("User does not exist", 400);

  response.json(userProfile);

  await ServerDataBase.destroyConnection();
};

export const followUser = async (request: Request, response: Response) => {
  const { userToFollowId } = request.body;
  const token = request.headers.authorization as string;

  if (!userToFollowId)
    throw new CustomError("Invalid or missing 'userToUnfollowId' ", 400);

  if (!(await new UserDatabase().getUserById(userToFollowId)))
    throw new CustomError("Invalid 'userToUnfollowId'", 400);

  const userInfo = new Authenticator().getData(token);

  await new FollowDatabase().followUser(userToFollowId, userInfo.id);

  response.json({
    message: "Followed successfully",
  });

  await ServerDataBase.destroyConnection();
};

export const unfollowUser = async (request: Request, response: Response) => {
  const { userToUnfollowId } = request.body;
  const token = request.headers.authorization as string;

  if (!userToUnfollowId)
    throw new CustomError("Invalid or missing 'userToUnfollowId' ", 400);

  if (!(await new UserDatabase().getUserById(userToUnfollowId)))
    throw new CustomError("Invalid 'userToUnfollowId'", 400);

  const userInfo = new Authenticator().getData(token);

  await new FollowDatabase().unfollowUser(userToUnfollowId, userInfo.id);

  response.json({
    message: "Unfollowed successfully",
  });

  await ServerDataBase.destroyConnection();
};
