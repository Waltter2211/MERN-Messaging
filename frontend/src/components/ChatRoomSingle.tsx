import { Dispatch, SetStateAction, useContext, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { chatRoomSendMessageService, chatRoomService } from "../services/chatRoomService"
import { MessagesType } from "../types/chatRoomTypes"
import { UserContext } from "../utils/UserContext"
import { LoggedInUser } from "../types/userContextTypes"

const ChatroomSingle = ({setSelected}: {setSelected: Dispatch<SetStateAction<boolean>>}) => {

  const { chatRoomId } = useParams()
  const currentUser = useContext(UserContext)
  const [userMessage, setUserMessage] = useState('')
  const { data, isLoading, error, refetch } = useQuery(`chatRoomSingleData${chatRoomId}`, () => chatRoomService(chatRoomId as string), {
    /* refetchInterval: 2000,
    refetchOnWindowFocus: true */
  })

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  const { messages } = data

  const handleExitWindow = () => {
    setSelected(false)
  }

  const handleMessageSubmit = async (event:React.FormEvent) => {
    event.preventDefault()
    const currentUserId = data.users.filter((user:LoggedInUser) => user.email === currentUser.loggedInUser.email)
    const messageObj = {
        messageBody: userMessage
    }
    chatRoomSendMessageService(data._id, currentUserId[0]._id, currentUser.loggedInUser.sessionToken, messageObj).then(() => {
        refetch()
        setUserMessage('')
    })
  }

  return (
    <div className="single-chat-room-div">
        <div className="single-chat-room-info-div">
            <h1>ChatroomSingle</h1>
            <p>{chatRoomId}</p>
            <button onClick={handleExitWindow}>X</button>
        </div>
        <div className="single-chat-room-messages-list-div">
            {messages.map((message:MessagesType, index:number) => {
                return (
                    <div key={index}>
                        <h3>{message.sender}</h3>
                        <p>{message.messageBody}</p>
                        <p>{message.timestamps}</p>
                    </div>
                )
            })}
        </div>
        <div className="single-chat-room-input-div">
            <form onSubmit={handleMessageSubmit}>
                <input type="text" onChange={(event) => setUserMessage(event.target.value)} value={userMessage} />
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
  )
}

export default ChatroomSingle