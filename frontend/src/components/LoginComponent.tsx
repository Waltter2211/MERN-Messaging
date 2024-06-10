import { Link } from "react-router-dom"

const LoginComponent = () => {
  return (
    <div className="landingPageBackground">
        <div className="landingPageBackgroundOverlay">
            <div className="landingPageSelection">
                <h2><Link to={'/'}>Home</Link></h2>
                <h2>Login</h2>
            </div>
        </div>
    </div>
  )
}

export default LoginComponent