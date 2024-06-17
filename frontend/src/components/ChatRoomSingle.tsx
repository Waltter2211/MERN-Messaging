import { Dispatch, SetStateAction } from "react"
import { useParams } from "react-router-dom"

const ChatroomSingle = ({setSelected}: {setSelected: Dispatch<SetStateAction<boolean>>}) => {

  const { chatRoomId } = useParams()

  const handleExitWindow = () => {
    setSelected(false)
  }

  return (
    <div>
        <h1>ChatroomSingle</h1>
        <p>{chatRoomId}</p>
        <button onClick={handleExitWindow}>X</button>
    </div>
  )
}

export default ChatroomSingle