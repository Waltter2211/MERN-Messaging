import { chatroomService } from "../services/chatRoomService"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../utils/UserContext"
import { ChatRoomSingleType } from "../types/chatRoomTypes"

const ChatroomSingle = ({ chatRoomId }: { chatRoomId:string }) => {

  const currentUser = useContext(UserContext)

  const [chatRoomData, setChatRoomData] = useState<ChatRoomSingleType | null>(null)

  useEffect(() => {
    chatroomService(chatRoomId).then((data) => {
        setChatRoomData(data)
    })
  }, [chatRoomId])

  if (chatRoomData === null) return <div>loading</div>

  console.log(chatRoomData)

  const filteredUser = chatRoomData.users.filter((user) => user.email !== currentUser.loggedInUser.email)

  return (
    <div>
        <h2>{filteredUser[0].name}</h2>
        {chatRoomData.messages.length === 0
        ? <p>no messages sent</p>
        : <p>{chatRoomData.messages[chatRoomData.messages.length -1]?.sender}: {chatRoomData.messages[chatRoomData.messages.length -1]?.messageBody}</p> }
    </div>
  )
}

export default ChatroomSingle