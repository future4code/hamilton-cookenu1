import { ServerDataBase } from "./ServerDataBase";

export class RecipeDataBase extends ServerDataBase {

    private static TABLE_NAME = "recipes_cookenu";

    public async createRecipe(
        id : string,
        title : string,
        description : string,
        created_at : Date,
        user_id : string,
    ): Promise<void> {

        await this.getConnection()
            .insert({
                id,
                title,
                description,
                created_at,
                user_id,
            })
            .into(RecipeDataBase.TABLE_NAME);
    }

    public async getRecipeById( id : string ): Promise<any> {
        const result = await this.getConnection()
            .select("*")
            .from(RecipeDataBase.TABLE_NAME)
            .where({ id });

        return result[0];
    }
}
