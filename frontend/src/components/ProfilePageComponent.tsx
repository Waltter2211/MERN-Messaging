import { useContext } from "react"
import { UserContext } from "../utils/UserContext"

const ProfilePageComponent = () => {

  const user = useContext(UserContext)

  return (
    <div>
      <h1>ProfilePageComponent</h1>
      <p>{user.loggedInUser.email}</p>
    </div>
  )
}

export default ProfilePageComponent