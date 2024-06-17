import { UserSentMessageType } from "../types/chatRoomTypes"

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

export const chatRoomSendMessageService = async (chatRoomId:string, userId:string, authorizationToken:string, messageObj:UserSentMessageType) => {
    const response = await fetch(`http://localhost:3000/api/chatRooms/${chatRoomId}/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authorizationToken}`
        },
        body: JSON.stringify(messageObj)
    })

    if (response.status === 404 || response.status === 401) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result
    }
}