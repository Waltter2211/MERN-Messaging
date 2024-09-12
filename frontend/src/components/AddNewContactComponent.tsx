import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import { UserContext } from "../utils/UserContext"
import { createNewChatRoomService } from "../services/chatRoomService"
import { ToastContainer } from "react-toastify"
import { logoutService } from "../services/loginService"
import { notifyError, notifySuccess } from "../services/toastifyService"
import socket from "../socket"

const AddNewContactComponent = ({setNewContactSelected, newContactSelected}: {newContactSelected:React.ComponentState, setNewContactSelected:Dispatch<SetStateAction<boolean>>}) => {

  const currentUser = useContext(UserContext)

  const [userSearch, setUserSearch] = useState('')

  const handleUserSearchInput = (event:React.ChangeEvent<HTMLInputElement>) => {
    setUserSearch(event.target.value)
  }

  const handleUserSearch = async (event:React.FormEvent) => {
    event.preventDefault()
    const recipientObj = {
      user: userSearch
    }
    const localStrorageUserTokenObj = localStorage.getItem('token')

    if (localStrorageUserTokenObj) {
      const foundUserData = await createNewChatRoomService(currentUser.loggedInUser.email, recipientObj, currentUser.loggedInUser.sessionToken)
      if (foundUserData.status === 404) {
        notifyError(foundUserData.message)
      }
      else if (foundUserData.status === 401) {
        notifyError(foundUserData.message)
      }
      else {
        socket.emit('join room', foundUserData.createdRoom._id)
        console.log(foundUserData.createdRoom._id)
        socket.emit('add room', foundUserData.createdRoom._id)
        notifySuccess(foundUserData.message)
      }
    } else {
      notifyError('Session token has expired, please login again')
      logoutService(currentUser.loggedInUser.email, currentUser.loggedInUser.sessionToken)
      setTimeout(() => {
        location.reload()
      },  5000)
    }
  }

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
    <div className="add-new-contact-popup-background-div">
      <div className="add-new-contact-popup-div">
        <div className="add-new-contact-popup-div-up">
          <div className="add-new-contact-popup-close-div">
            <i className="fa-solid fa-x close-button" onClick={() => setNewContactSelected(!newContactSelected)}></i>
          </div>
        </div>
        <div className="add-new-contact-popup-div-down">
          <h2>Add new contact</h2>
            <form onSubmit={handleUserSearch}>
              <input type="text" placeholder="Enter user email address" onChange={handleUserSearchInput} />
              <button type="submit">add</button>
            </form>
          </div>
      </div>
    </div>
    </>
    
  )
}

export default AddNewContactComponent