import { ServerDataBase } from "./ServerDataBase";

export class UserDatabase extends ServerDataBase {

    private static TABLE_NAME = "users_cookenu";

    public async createUser(
        id: string,
        name: string,
        password: string,
        email: string,
        role: string
    ): Promise<void> {

        await this.getConnection()
            .insert({
                id,
                name,
                email,
                password,
                role
            })
            .into(UserDatabase.TABLE_NAME);
    }

    public async getUserByEmail(email: string): Promise<any> {
        const result = await this.getConnection()
            .select("*")
            .from(UserDatabase.TABLE_NAME)
            .where({ email });

        return result[0];
    }

    public async getUserById(id: string): Promise<any> {
        const result = await this.getConnection()
            .select("*")
            .from(UserDatabase.TABLE_NAME)
            .where({ id });

        return result[0];
    }

    public async deleteUser(id: string): Promise<void> {
        await this.getConnection()
            .where({ id: id })
            .del()
            .from(UserDatabase.TABLE_NAME);
    }
}
