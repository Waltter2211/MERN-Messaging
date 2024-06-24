import { useContext, useState } from "react"
import { UserContext } from "../utils/UserContext"
import { useQuery } from "react-query"
import { userService } from "../services/userService"
import { ChatRoomType } from "../types/chatRoomTypes"
import ChatroomSingleList from "./ChatRoomSingleList"
import ChatroomSingle from "./ChatRoomSingle"
import { Link } from "react-router-dom"
import { logoutService } from "../services/loginService"
import AddNewContactComponent from "./AddNewContactComponent"

const ProfilePageComponent = () => {

  const currentUser = useContext(UserContext)
  const { data, isLoading, error } = useQuery('userChatroomData', () => userService(currentUser.loggedInUser.email, currentUser.loggedInUser.sessionToken), {
    refetchInterval: 2000,
    refetchOnWindowFocus: true
  })

  const handleLogout = () => {
    logoutService(currentUser.loggedInUser.email, currentUser.loggedInUser.sessionToken).then(() => {
      localStorage.clear()
      location.reload()
    })
  }

  const [selected, setSelected] = useState(false)
  const [newContactSelected, setNewContactSelected] = useState(false)

  if (isLoading) return <div>loading</div>

  if (error) return <div>error</div>

  const { chatRooms } = data

  chatRooms.sort((roomA:ChatRoomType, roomB:ChatRoomType) => roomB.updatedAt.localeCompare(roomA.updatedAt))

  return (
    <>
    <div className="profile-page-main-up">
      <h2>MERN-Messaging</h2>
      <h2>{currentUser.loggedInUser.email}</h2>
      <i onClick={handleLogout} className="fa-solid fa-power-off power-button"></i>
    </div>
    <div className="profile-page-main-down">
      <div className="profile-page-contacts-list">
        <div className="profile-page-contacts-list-div">
          {data.chatRooms.length === 0
          ? <p>No chats in list</p>
          : chatRooms.map((room:ChatRoomType) => {
            return (
              <div key={room._id} className="profile-page-contacts-list-room" onClick={() => setSelected(true)}>
                <Link to={`${room._id}`}><ChatroomSingleList chatRoomId={room._id} /></Link>
              </div>
            )
          })}
        </div>
        <div className="add-new-contact-button-div">
          <i className="fa-solid fa-plus add-new-contact-button" onClick={() => setNewContactSelected(!newContactSelected)}></i>
        </div>
      </div>
      <div className="profile-page-message-window">
        {selected ? <ChatroomSingle setSelected={setSelected} /> : <p>No current active chat rooms</p>}
      </div>
      {newContactSelected ? <AddNewContactComponent newContactSelected={newContactSelected} setNewContactSelected={setNewContactSelected} /> : <div></div>}
    </div>
    </>
  )
}

export default ProfilePageComponent