import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { chatRoomSendMessageService, chatRoomService } from "../services/chatRoomService"
import { ChatRoomSingleUsers, MessagesType } from "../types/chatRoomTypes"
import { UserContext } from "../utils/UserContext"
import { LoggedInUser } from "../types/userContextTypes"
import { logoutService } from "../services/loginService"
import { ToastContainer } from "react-toastify"
import { notifyError } from "../services/toastifyService"

const ChatroomSingle = ({setSelected}: {setSelected: Dispatch<SetStateAction<boolean>>}) => {

  const { chatRoomId } = useParams()
  const currentUser = useContext(UserContext)
  const [userMessage, setUserMessage] = useState('')
  const { data, isLoading, error, refetch } = useQuery(`chatRoomSingleData${chatRoomId}`, () => chatRoomService(chatRoomId as string), {
    /* refetchInterval: 2000a
    refetchOnWindowFocus: true */
  })

  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({ block: 'nearest' })
    }
  }, [data?.messages])

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  const { messages, users } = data

  const handleExitWindow = () => {
    setSelected(false)
  }

  const handleMessageSubmit = async (event:React.FormEvent) => {
    event.preventDefault()
    const currentUserId = data.users.filter((user:LoggedInUser) => user.email === currentUser.loggedInUser.email)
    const messageObj = {
      messageBody: userMessage
    }

    const localStrorageUserTokenObj = localStorage.getItem('token')

    if (localStrorageUserTokenObj) {
      chatRoomSendMessageService(data._id, currentUserId[0]._id, localStrorageUserTokenObj, messageObj).then(() => {
        refetch()
        setUserMessage('')
      })
    } else {
      notifyError('Session token has expired, please login again')
      logoutService(currentUser.loggedInUser.email, currentUser.loggedInUser.sessionToken)
      setTimeout(() => {
        location.reload()
      },  5000)
    }
  }

  const filteredUser = users.filter((user:ChatRoomSingleUsers) => user.email !== currentUser.loggedInUser.email)
  const filteredCurrentUser = users.filter((user:ChatRoomSingleUsers) => user.email === currentUser.loggedInUser.email)

  return (
    <>
    <ToastContainer
    position="top-center"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="colored"
    /* transition: Zoom, */
    />
    <div className="single-chat-room-div">
        <div className="single-chat-room-info-div">
          <h1>{filteredUser[0].name}</h1>
          <i className="fa-solid fa-x close-button" onClick={handleExitWindow}></i>
        </div>
        <div className="single-chat-room-messages-list-div" id="messages-div">
            {messages.length === 0 ? <div>Start chatting with {filteredUser[0].name} by sending a message</div> : messages.map((message:MessagesType, index:number) => {
                return (
                  <div className={message.sender === filteredCurrentUser[0].name ? "single-message-div-self" : "single-message-div"} key={index}>
                    {/* <h3>{message.sender}</h3> */}
                    <div className={message.sender === filteredCurrentUser[0].name ? "single-message-content-div-self" : "single-message-content-div"}>
                      <p className="single-message-content">{message.messageBody}</p>
                      <p className="single-message-timestamp">{message.timestamps.substring(0, 5)}</p>
                    </div>
                  </div>
                )
            })}
            <div ref={chatRef}></div>
        </div>
        <div className="single-chat-room-input-div">
            <form onSubmit={handleMessageSubmit}>
                <textarea placeholder="Message..." onChange={(event) => setUserMessage(event.target.value)} value={userMessage} />
                <button className="submit-button" type="submit"><i className="fa-solid fa-square-caret-right"></i></button>
            </form>
        </div>
    </div>
    </>
  )
}

export default ChatroomSingle