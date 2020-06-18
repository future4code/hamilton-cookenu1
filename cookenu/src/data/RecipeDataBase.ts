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

    public async getUserBycreated_at(created_at: string): Promise<any> {
        const result = await this.getConnection()
            .select("*")
            .from(RecipeDataBase.TABLE_NAME)
            .where({ created_at });

        return result[0];
    }

    public async getUserById(id: string): Promise<any> {
        const result = await this.getConnection()
            .select("*")
            .from(RecipeDataBase.TABLE_NAME)
            .where({ id });

        return result[0];
    }

    public async deleteUser(id: string): Promise<void> {
        await this.getConnection()
            .where({ id: id })
            .del()
            .from(RecipeDataBase.TABLE_NAME);
    }
}
