import { Dispatch, SetStateAction } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { chatRoomService } from "../services/chatRoomService"
import { MessagesType } from "../types/chatRoomTypes"

const ChatroomSingle = ({setSelected}: {setSelected: Dispatch<SetStateAction<boolean>>}) => {

  const { chatRoomId } = useParams()

  const { data, isLoading, error, refetch } = useQuery('singleChatRoomData', () => chatRoomService(chatRoomId as string))

  refetch()

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  /* console.log(data.messages) */

  const { messages } = data

  const handleExitWindow = () => {
    setSelected(false)
  }

  return (
    <div>
        <h1>ChatroomSingle</h1>
        <p>{chatRoomId}</p>
        <button onClick={handleExitWindow}>X</button>
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
  )
}

export default ChatroomSingle