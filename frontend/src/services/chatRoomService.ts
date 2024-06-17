export const chatRoomService = async (chatRoomId:string) => {
    const response = await fetch(`http://localhost:3000/api/chatRooms/${chatRoomId}`, {
        method: "GET",
    })

    if (response.status === 404) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result
    }
}