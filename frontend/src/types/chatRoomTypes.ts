type MessagesType = {
    sender:string
    messageBody:string
    timestamps:string
}

export interface ChatroomType {
    messages:MessagesType[]
    users:string[]
    _id:string
}