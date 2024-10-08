import { LoginObj } from "../types/loginTypes"

export const loginService = async (userObj:LoginObj) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
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

export const logoutService = async (userId:string, sessionToken:string) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${sessionToken}`
        }
    })
    if (response.status === 404 || response.status === 401) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result
    }
}

export const verifySessionService = async (sessionToken:string) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionToken}`
        }
    })
    if (response.status === 404) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result.verifiedToken
    }
}