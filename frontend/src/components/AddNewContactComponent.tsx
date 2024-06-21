import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import { UserContext } from "../utils/UserContext"
import { createNewChatRoomService } from "../services/chatRoomService"
import { ToastContainer, toast } from "react-toastify"

const AddNewContactComponent = ({setNewContactSelected, newContactSelected}: {newContactSelected:React.ComponentState, setNewContactSelected:Dispatch<SetStateAction<boolean>>}) => {
  
  const notifyError = (message:string) => toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    /* transition: Zoom, */
  });

  const notifySuccess = (message:string) => toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    /* transition: Zoom, */
  });

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
    const foundUserData = await createNewChatRoomService(currentUser.loggedInUser.email, recipientObj, currentUser.loggedInUser.sessionToken)
    console.log(foundUserData)
    if (foundUserData.status === 404) {
      notifyError(foundUserData.message)
    }
    else if (foundUserData.status === 401) {
      notifyError(foundUserData.message)
    }
    else {
      notifySuccess(foundUserData.message)
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