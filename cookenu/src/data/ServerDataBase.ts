import knex from "knex";
import Knex   from "knex";

export class ServerDataBase {

    private static connection : Knex | null = null;

    protected getConnection() : Knex {
        if(!ServerDataBase.connection){
            ServerDataBase.connection = knex({
                client: "mysql",
                connection: {
                  host: process.env.DB_HOST,
                  port: Number(process.env.DB_PORT),
                  user: process.env.DB_USER,
                  password: process.env.DB_PASSWORD,
                  database: process.env.DB_DATABASE,
                },
              });        
        }

        return ServerDataBase.connection;
    }

    public static async destroyConnection() : Promise<void>{
        if(ServerDataBase.connection){
            await ServerDataBase.connection.destroy();
            ServerDataBase.connection = null;
        }
    }
}