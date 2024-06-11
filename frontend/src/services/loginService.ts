import { LoginObj } from "../types/loginTypes"

export const loginService = async (userObj:LoginObj) => {
    const response = await fetch('http://localhost:3000/api/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userObj)
    })

    if (response.status === 404 || response.status === 401) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result
    }
}