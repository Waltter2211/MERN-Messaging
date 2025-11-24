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
      <div className="contact-list-div-image">
        <img src="../public/placeholder.PNG" />
        {filteredUser[0].isOnline ? <div className="loggedBallFrame"><div className="loggedInBall"></div></div> : <div className="loggedBallFrame"><div className="loggedOutBall"></div></div>}
      </div>
      <div className="contact-list-info">
        <h3>{filteredUser[0].name}</h3>
        {data.messages.length === 0
        ? <p>No messages sent</p>
        : <p>{/* {messages[messages.length -1]?.sender}:  */}{messages[messages.length -1]?.messageBody}</p> }
      </div>
      <div className="contact-list-received">
        <h3>2m</h3>
        <p>2</p>
      </div>
    </div>
  )
}

export default ChatRoomSingleList