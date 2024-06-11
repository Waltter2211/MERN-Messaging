import { Link } from "react-router-dom"

const LandingPageComponent = () => {
  return (
    <div className="landingPageBackground">
        <div className="landingPageBackgroundOverlay">
            <div className="landingPageSelection">
                <h2>Mern Messaging</h2>
                <Link to={'/login'}>Login</Link>
                <Link to={'/register'}>Register</Link>
            </div>
        </div>
    </div>
  )
}

export default LandingPageComponent