export const userService = async (userEmail:string, authorizationToken:string) => {
    console.log(authorizationToken)
    const response = await fetch(`http://localhost:3000/api/users/${userEmail}`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${authorizationToken}`
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