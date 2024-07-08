export const userService = async (userEmail:string, authorizationToken:string) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userEmail}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${authorizationToken}`
        }
    })

    if (response.status === 404 || response.status === 401) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result.user
    }
}