export type MessagesType = {
    sender:string
    messageBody:string
    timestamps:string
}

export interface ChatRoomType {
    messages:MessagesType[]
    users:string[]
    _id:string
}

type ChatRoomSingleUsers = {
    _id:string
    chatRooms:string[]
    email:string
    name:string
    password:string
}

export interface ChatRoomSingleType {
    messages:MessagesType[]
    users:ChatRoomSingleUsers[]
    _id:string
}