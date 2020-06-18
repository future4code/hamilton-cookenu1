import { Request, Response } from 'express'
import { Authenticator } from '../services/Authenticator'
import { UserDatabase } from '../data/UserDataBase'
import { ServerDataBase } from '../data/ServerDataBase'


export const getProfileEndingPoint = async (
    request : Request,
    response : Response
) => {

    const token = request.headers.authorization as string
    console.log('token',token)
    const userInfo = await new Authenticator().getData( token )
    console.log('userinfo',token)

    const userProfile = await new UserDatabase().getUserById( userInfo.id )
    console.log('userpfoiel',token)

    response
        .status(200)
        .send({
            id: userProfile.id,
            email: userProfile.email
        })
    
    await ServerDataBase.destroyConnection()
}