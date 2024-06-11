import { Link } from "react-router-dom"

const LoginComponent = () => {
  return (
    <div className="landingPageBackground">
        <div className="landingPageBackgroundOverlay">
            <div className="landingPageSelection">
              <h2>Login</h2>
              <Link to={'/'}>Home</Link>
            </div>
        </div>
    </div>
  )
}

export default LoginComponent