import { RegisterObj } from "../types/registerTypes"

export const registerService = async (userObj:RegisterObj) => {
    const response = await fetch('http://localhost:3000/api/users', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(userObj)
    })

    if (response.status === 401) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result
    }
}