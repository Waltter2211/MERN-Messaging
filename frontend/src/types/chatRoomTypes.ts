export type MessagesType = {
    sender:string
    messageBody:string
    timestamps:string
}

export interface ChatRoomType {
    createdAt:string
    messages:MessagesType[]
    updatedAt:string
    users:ChatRoomSingleUsers[]
    _id:string
}

export type ChatRoomSingleUsers = {
    _id:string
    chatRooms:string[]
    email:string
    name:string
    password:string
}

/* export interface ChatRoomSingleType {
    messages:MessagesType[]
    users:ChatRoomSingleUsers[]
    _id:string
} */

export interface UserSentMessageType {
    messageBody:string
}

export type RecipientUserType = {
    user:string
}