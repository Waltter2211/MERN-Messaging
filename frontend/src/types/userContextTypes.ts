import { SetStateAction } from "react"

export type LoggedInUser = {
    name:string
    email:string
    sessionToken:string
}

export interface LoggedInUserContext {
    loggedInUser:LoggedInUser
    setLoggedInUser:React.Dispatch<SetStateAction<LoggedInUser>>
}