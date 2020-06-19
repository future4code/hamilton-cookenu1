import { ServerDataBase } from "./ServerDataBase";

export class RecipeDataBase extends ServerDataBase {
  private static TABLE_NAME = "recipes_cookenu";

  public async createRecipe(
    id: string,
    title: string,
    description: string,
    created_at: Date,
    user_id: string
  ): Promise<void> {
    await this.getConnection().into(RecipeDataBase.TABLE_NAME).insert({
      id,
      title,
      description,
      created_at,
      user_id,
    });
  }

  public async getRecipeById(id: string): Promise<any> {
    const result = await this.getConnection()
      .select("*")
      .from(RecipeDataBase.TABLE_NAME)
      .where({ id });

    return result[0];
  }

  public async getRecipesByUserId(user_id: string) {
    return await this.getConnection()
      .select("*")
      .from(RecipeDataBase.TABLE_NAME)
      .where({ user_id });
  }
}
