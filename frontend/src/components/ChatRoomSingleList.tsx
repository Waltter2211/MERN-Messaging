import { chatRoomService } from "../services/chatRoomService"
import { useContext } from "react"
import { UserContext } from "../utils/UserContext"
import { useQuery } from "react-query"
import { ChatRoomSingleUsers } from "../types/chatRoomTypes"

const ChatRoomSingleList = ({ chatRoomId }: { chatRoomId:string }) => {

  const currentUser = useContext(UserContext)

  const { data, isLoading, error } = useQuery(`chatRoomSingleData${chatRoomId}`, () => chatRoomService(chatRoomId), {
    refetchInterval: 2000,
    refetchOnWindowFocus: true
  })

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  const { users, messages } = data

  /* console.log(users) */

  const filteredUser = users.filter((user:ChatRoomSingleUsers) => user.email !== currentUser.loggedInUser.email)

  return (
    <div className="contact-list-div">
      <div className="contact-list-info">
      <h2>{filteredUser[0].name}</h2>
      {filteredUser[0].isOnline ? <div className="loggedInBall"></div> : <div className="loggedOutBall"></div>}
      </div>
        {messages.length === 0
        ? <p>no messages sent</p>
        : <p>{messages[messages.length -1]?.sender}: {messages[messages.length -1]?.messageBody}</p> }
    </div>
  )
}

export default ChatRoomSingleList