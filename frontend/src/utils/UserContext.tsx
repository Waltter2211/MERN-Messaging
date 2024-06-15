import { createContext } from "react";
import { LoggedInUserContext } from "../types/userContextTypes";

export const UserContext = createContext<LoggedInUserContext>({
    loggedInUser: {
        name:'',
        email: '',
        sessionToken:''
    },
    setLoggedInUser: () => {}
})