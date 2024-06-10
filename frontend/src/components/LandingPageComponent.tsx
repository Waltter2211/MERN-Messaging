import { Link } from "react-router-dom"

const LandingPageComponent = () => {
  return (
    <div className="landingPageBackground">
        <div className="landingPageBackgroundOverlay">
            <div className="landingPageSelection">
                <h2><Link to={'/login'}>Login</Link></h2>
                <h2><Link to={'/register'}>Register</Link></h2>
            </div>
        </div>
    </div>
  )
}

export default LandingPageComponent