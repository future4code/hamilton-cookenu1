import { Request, Response} from "express"
import { Authenticator } from "../services/Authenticator"
import { CustomError } from "../Util/CustomError"
import { UserDatabase } from "../data/UserDataBase"
import { ServerDataBase } from "../data/ServerDataBase"


export const renewRefreshToken = async (
    request : Request,
    response : Response
) => {

    const { refreshToken, device } = request.body

    const authenticator = new Authenticator()
    const userData = await authenticator.getData(refreshToken)

    if( userData.device !== device ){
        throw new CustomError("Logue novamente!", 412)
    }

    const user = await new UserDatabase().getUserById(userData.id)

    const newAccessToken = await authenticator.generateToken(
        {
            id: user.id,
            role: user.role
        }
    )

    response.status(200).send({
        "acces token": newAccessToken
    })

    await ServerDataBase.destroyConnection()
}