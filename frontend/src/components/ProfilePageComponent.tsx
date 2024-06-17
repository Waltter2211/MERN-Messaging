import { useContext, useState } from "react"
import { UserContext } from "../utils/UserContext"
import { useQuery } from "react-query"
import { userService } from "../services/userService"
import { ChatRoomType } from "../types/chatRoomTypes"
import ChatroomSingleList from "./ChatRoomSingleList"
import ChatroomSingle from "./ChatRoomSingle"
import { Link } from "react-router-dom"

const ProfilePageComponent = () => {

  const currentUser = useContext(UserContext)

  const { data, isLoading, error, refetch } = useQuery('userChatroomData', () => userService(currentUser.loggedInUser.email, currentUser.loggedInUser.sessionToken))

  const handleRefresh = () => {
    refetch()
  }

  const [selected, setSelected] = useState(false)

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  /* console.log(data) */

  const { chatRooms } = data

  return (
    <>
    <div className="profile-page-main-up">
      <h2>logged in as {currentUser.loggedInUser.email}</h2>
      <button onClick={handleRefresh}>reload</button>
      <button onClick={() => {
        localStorage.clear()
        location.reload()
      }}>logout</button>
    </div>
    <div className="profile-page-main-down">
      <div className="profile-page-contacts-list">
        {chatRooms.map((room:ChatRoomType) => {
          return (
            <div key={room._id} className="profile-page-contacts-list-room" onClick={() => setSelected(true)}>
              <Link to={`${room._id}`}><ChatroomSingleList chatRoomId={room._id} /></Link>
            </div>
          )
        })}
      </div>
      <div className="profile-page-message-window">
        {selected ? <ChatroomSingle setSelected={setSelected} /> : <p>no current chat rooms</p>}
      </div>
    </div>
    </>
  )
}

export default ProfilePageComponent