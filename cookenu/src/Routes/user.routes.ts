import { Request, Response, Router } from "express";
import { FollowDatabase } from "../data/FollowDatabase";
import { RecipeDataBase } from "../data/RecipeDataBase";
import { ServerDataBase } from "../data/ServerDataBase";
import { UserDatabase } from "../data/UserDataBase";
import { Authenticator } from "../services/Authenticator";
import { CustomError } from "../Util/CustomError";
import moment from "moment";
import { RefreshTokenDataBase } from "../data/RefreshTokenDataBase";

const getProfileEndingPoint = async (request: Request, response: Response) => {
  const token = request.headers.authorization as string;

  const userInfo = new Authenticator().getData(token);

  const userProfile = await new UserDatabase().getUserById(userInfo.id);

  response.status(200).send({
    id: userProfile.id,
    email: userProfile.email,
  });

  await ServerDataBase.destroyConnection();
};

const getOtherUserProfileEndpoint = async (
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

const followUserEndpoint = async (request: Request, response: Response) => {
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

const unfollowUserEndpoint = async (request: Request, response: Response) => {
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

const getFeeedEndpoint = async (request: Request, response: Response) => {
  const token = request.headers.authorization as string;
  const userInfo = new Authenticator().getData(token);

  const followingUsers = await new FollowDatabase().getFollowing(userInfo.id);

  const recipeDatabase = new RecipeDataBase();
  const userDatabase = new UserDatabase();

  const recipes: any[] = [];

  for (let i = 0; i < followingUsers.length; i++) {
    const [user, userRecipes] = await Promise.all([
      userDatabase.getUserById(followingUsers[i].id_following),
      recipeDatabase.getRecipesByUserId(followingUsers[i].id_following),
    ]);

    userRecipes.forEach((recipe: Object) =>
      recipes.push({ ...recipe, userName: user.name })
    );
  }

  recipes.sort((b, a) => {
    const aDate = new Date(a.created_at);
    const bDate = new Date(b.created_at);
    return aDate.getTime() - bDate.getTime();
  });

  response.status(200).send(recipes);
  await ServerDataBase.destroyConnection();
};

const deleteUserEndpoint = async (request: Request, response: Response) => {
  const token = request.headers.authorization as string;
  const userInfo = new Authenticator().getData(token);
  const { id } = request.params;

  const userDatabase = new UserDatabase();

  if (userInfo.role !== "admin")
    throw new CustomError("Usuário is not Admin", 402);

  if (!(await userDatabase.getUserById(id)))
    throw new CustomError("User does not exist", 400);

  await new RefreshTokenDataBase().deleteUserRefreshToken(id);
  await new FollowDatabase().deleteAllUserRelations(id);
  await new RecipeDataBase().deleteAllRecipesFromUser(id);
  await userDatabase.deleteUser(id);

  response.status(200).send({ message: "User successfully deleted" });

  await ServerDataBase.destroyConnection();
};

const userRoute = Router();

userRoute.get("/profile", getProfileEndingPoint);
userRoute.get("/feed", getFeeedEndpoint);
userRoute.get("/:id", getOtherUserProfileEndpoint);
userRoute.post("/follow", followUserEndpoint);
userRoute.post("/unfollow", unfollowUserEndpoint);
userRoute.delete("/:id", deleteUserEndpoint);

export default userRoute;
