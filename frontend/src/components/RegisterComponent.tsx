import { Link } from "react-router-dom"

const RegisterComponent = () => {
  return (
    <div className="landingPageBackground">
      <div className="landingPageBackgroundOverlay">
        <div className="landingPageSelection">
          <h2>Register</h2>
          <Link to={'/'}>Home</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterComponent