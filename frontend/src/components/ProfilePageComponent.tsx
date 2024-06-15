import { useContext } from "react"
import { UserContext } from "../utils/UserContext"
import { useQuery } from "react-query"
import { userService } from "../services/userService"
import { ChatRoomType } from "../types/chatRoomTypes"
import ChatroomSingle from "./ChatRoomSingle"

const ProfilePageComponent = () => {

  const currentUser = useContext(UserContext)

  const { data, isLoading, error, refetch } = useQuery('userChatroomData', () => userService(currentUser.loggedInUser.email, currentUser.loggedInUser.sessionToken))

  const handleRefresh = () => {
    refetch()
  }

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  console.log(data)

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
            <div key={room._id}>
              <ChatroomSingle chatRoomId={room._id} />
            </div>
          )
        })}
      </div>
      <div className="profile-page-message-window">

      </div>
    </div>
    </>
  )
}

export default ProfilePageComponent