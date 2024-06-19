import React, { Dispatch, SetStateAction, useContext, useState } from "react"
import { UserContext } from "../utils/UserContext"
import { createNewChatRoomService } from "../services/chatRoomService"

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
    const foundUserData = await createNewChatRoomService(currentUser.loggedInUser.email, recipientObj, currentUser.loggedInUser.sessionToken)
    console.log(foundUserData)
  }

  return (
    <div className="add-new-contact-popup-background-div">
        <div className="add-new-contact-popup-div">
            <div>
                <button onClick={() => setNewContactSelected(!newContactSelected)}>X</button>
            </div>
            <h2>Add new contact</h2>
            <form onSubmit={handleUserSearch}>
                <input type="text" onChange={handleUserSearchInput} />
                <button type="submit">add</button>
            </form>
        </div>
    </div>
  )
}

export default AddNewContactComponent