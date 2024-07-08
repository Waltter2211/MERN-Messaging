import { RecipientUserType, UserSentMessageType } from "../types/chatRoomTypes"

/* http://localhost:3000/ */

export const chatRoomService = async (chatRoomId:string) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chatRooms/${chatRoomId}`)

    if (response.status === 404) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result.foundChatRoom
    }
}

export const chatRoomSendMessageService = async (chatRoomId:string, userId:string, authorizationToken:string, messageObj:UserSentMessageType) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chatRooms/${chatRoomId}/${userId}`, {
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

export const createNewChatRoomService = async (userEmail:string, recipientUserEmail:RecipientUserType, sessionToken:string) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chatRooms/${userEmail}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionToken}`
        },
        body: JSON.stringify(recipientUserEmail)
    })

    if (response.status === 404 || response.status === 401) {
        const responseObj = await response.json()
        return {status: response.status, message: responseObj.message}
    } else {
        const result = await response.json()
        return result
    }
}