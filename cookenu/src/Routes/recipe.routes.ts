import { Request, Response } from "express"
import { RecipeDataBase } from "../data/RecipeDataBase"
import { Authenticator } from "../services/Authenticator"
import { IdGenerator } from "../services/IdGenetor"

export const createRecipeEndingPoint = async (
    request: Request,
    response: Response
) => {

    const id = new IdGenerator().generate()

    const { title, description } = request.body
    const token = request.headers.authorization as string

    const userInfo = await new Authenticator().getData(token)

    await new RecipeDataBase().createRecipe(
        id,
        title,
        description,
        new Date,
        userInfo.id
    )

    response.status(200).send({
        message: `Receita criada com sucesso!`,
    })
}