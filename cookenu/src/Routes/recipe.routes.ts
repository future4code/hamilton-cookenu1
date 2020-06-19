import { Request, Response, Router } from "express";
import { RecipeDataBase } from "../data/RecipeDataBase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenetor";
import { CustomError } from "../Util/CustomError";

const createRecipeEndingPoint = async (
  request: Request,
  response: Response
) => {
  const id = new IdGenerator().generate();

  const { title, description } = request.body;
  const token = request.headers.authorization as string;

  const userInfo = await new Authenticator().getData(token);

  await new RecipeDataBase().createRecipe(
    id,
    title,
    description,
    new Date(),
    userInfo.id
  );

  response.status(200).send({
    message: `Receita criada com sucesso!`,
  });
};

const getRecipeEndingPoint = async (request: Request, response: Response) => {
  const id = request.params.id;
  const token = request.headers.authorization as string;

  const userInfo = await new Authenticator().getData(token);

  const recipe = await new RecipeDataBase().getRecipeById(id);
  console.log(userInfo.id, recipe.user_id);
  if (userInfo.id !== recipe.user_id) {
    throw new CustomError("Problemas na autenticação!", 401);
  }

  response.status(200).send(recipe);
};

const editRecipeEndingPoint = async (
    request : Request,
    response : Response
) => {

    const token = request.headers.authorization as string
    const { recipeId, recipeTitle, recipeDescription } = request.body

    const user = await new Authenticator().getData( token )
    const recipeCheck = await new RecipeDataBase().getRecipesByUserId( user.id )
    if(recipeCheck.user_id !== user.id){
        throw new CustomError(
            "Esta receita não pode ser modificada por esse usuário",
            400
            )
    }

    await new RecipeDataBase().editRecipe(
        recipeId,
        recipeTitle,
        recipeDescription
    )

    response.status(200).send({ message: "Receita atualizada com sucesso!"})
}

const recipeRoute = Router();

recipeRoute.post("/", createRecipeEndingPoint);
recipeRoute.put("/edit", editRecipeEndingPoint);
recipeRoute.get("/:id", getRecipeEndingPoint);

export default recipeRoute;
