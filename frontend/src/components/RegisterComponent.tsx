import { Link } from "react-router-dom"

const RegisterComponent = () => {
  return (
    <div className="landingPageBackground">
        <div className="landingPageBackgroundOverlay">
            <div className="landingPageSelection">
                <h2><Link to={'/'}>Home</Link></h2>
                <h2>Register</h2>
            </div>
        </div>
    </div>
  )
}

export default RegisterComponent