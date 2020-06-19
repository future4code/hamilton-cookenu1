import { Request, Response } from 'express'
import { Authenticator } from '../services/Authenticator'
import { UserDatabase } from '../data/UserDataBase'
import { ServerDataBase } from '../data/ServerDataBase'


export const getProfileEndingPoint = async (
    request : Request,
    response : Response
) => {

    const token = request.headers.authorization as string

    const userInfo = await new Authenticator().getData( token )

    const userProfile = await new UserDatabase().getUserById( userInfo.id )

    response
        .status(200)
        .send({
            id: userProfile.id,
            email: userProfile.email
        })
    
    await ServerDataBase.destroyConnection()
}