import { chatRoomService } from "../services/chatRoomService"
import { useContext } from "react"
import { UserContext } from "../utils/UserContext"
import { useQuery } from "react-query"
import { ChatRoomSingleUsers } from "../types/chatRoomTypes"
import socket from "../socket"

const ChatRoomSingleList = ({ chatRoomId }: { chatRoomId:string }) => {

  const currentUser = useContext(UserContext)

  const { data, isLoading, error, refetch } = useQuery(`chatRoomSingleData${chatRoomId}`, () => chatRoomService(chatRoomId))

  socket.on('ping refetch', () => {
    refetch()
  })

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  const { users, messages } = data
  
  const filteredUser = users.filter((user:ChatRoomSingleUsers) => user.email !== currentUser.loggedInUser.email)

  return (
    <div className="contact-list-div">
      <div className="contact-list-info">
      <h2>{filteredUser[0].name}</h2>
      {filteredUser[0].isOnline ? <div className="loggedInBall"></div> : <div className="loggedOutBall"></div>}
      </div>
        {data.messages.length === 0
        ? <p>No messages sent</p>
        : <p>{messages[messages.length -1]?.sender}: {messages[messages.length -1]?.messageBody}</p> }
    </div>
  )
}

export default ChatRoomSingleList