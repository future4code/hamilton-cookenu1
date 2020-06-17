import { Request, Response} from "express"
import validateEmail from "../Util/emailValidate"
import { CustomError } from "../Util/CustomError"
import { validatePassword } from "../Util/validatePassword"
import { UserDatabase } from "../data/UserDataBase"
import { Authenticator } from "../services/Authenticator"
import { HashManager } from "../services/HashManager"

export const login = async (
    request : Request,
    response : Response
) => {

    const { email, password } = request.body

    const isEmail = validateEmail(email)
    if(!isEmail){
        throw new CustomError("Email inválido.", 412)
    }

    const isPassword = validatePassword(password)
    if(!isPassword){
        throw new CustomError("Formato de senha incorreto!", 412)
    }

    const user = await new UserDatabase().getUserByEmail(email)
    if(!user){
        throw new CustomError("Email ou senha incorreta!", 412)
    }
    
    const hashCompare = await new HashManager().compare(
        password,
        user.password
    )
    if(!hashCompare){
        throw new CustomError("Email ou senha incorreta!", 412)
    }
    

    if(user.role !== "normal" && user.role !== "admin"){
        throw new CustomError("O usuário só pode ser do tipo normal ou admin!", 412)
    }

    const newToken = await new Authenticator().generateToken({
        id: user.id, 
        role: user.role
    })

    response.status(200).send({
        message: `Usuário logado com sucesso!`,
        newToken
    })
}