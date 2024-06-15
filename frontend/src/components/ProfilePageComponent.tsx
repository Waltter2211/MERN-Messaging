import { useContext } from "react"
import { UserContext } from "../utils/UserContext"
import { useQuery } from "react-query"
import { userService } from "../services/userService"
import { ChatroomType } from "../types/chatRoomTypes"

const ProfilePageComponent = () => {

  const user = useContext(UserContext)

  const { data, isLoading, error, refetch } = useQuery('userChatroomData', () => userService(user.loggedInUser.email, user.loggedInUser.sessionToken))

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
      <h2>logged in as {user.loggedInUser.email}</h2>
      <button onClick={handleRefresh}>reload</button>
      <button onClick={() => {
        localStorage.clear()
        location.reload()
      }}>logout</button>
    </div>
    <div className="profile-page-main-down">
      <div className="profile-page-contacts-list">
        {chatRooms.map((room:ChatroomType) => {
          return (
            <div key={room._id}>
              <h2>{room._id}</h2>
              <h3>{room.users.filter((user:string) => user !== data._id)}</h3>
              <p>{room.messages[room.messages.length - 1].sender}: {room.messages[room.messages.length - 1].messageBody}</p>
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