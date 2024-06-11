import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginService } from "../services/loginService"

const LoginComponent = () => {

  const navigate = useNavigate()

  const [loginCreds, setLoginCreds] = useState({
    email: '',
    password: ''
  })

  const handleLoginForm = (event:React.ChangeEvent<HTMLInputElement>) => {
    setLoginCreds((prev) => {
      return {...prev, [event.target.name]: event.target.value}
    })
  }

  const handleLogin = async (event:React.FormEvent) => {
    event.preventDefault()

    const userObj = {
      email: loginCreds.email,
      password: loginCreds.password
    }

    const userCreds = await loginService(userObj)
    console.log(userCreds)
    if (userCreds.status === 404 || userCreds.status === 401) {
      console.log("display error message")
    } else {
      localStorage.setItem('token', userCreds.token)
      localStorage.setItem('email', userCreds.userCredentials.email)
      navigate('/profile')
    }
  }

  return (
    <div className="landingPageBackground">
      <div className="landingPageBackgroundOverlay">
        <div className="landingPageSelection">
          <h2>Login</h2>
          <div className="form-div">
            <form onSubmit={handleLogin}>
              <h3>Email</h3>
              <input type="email" name="email" onChange={handleLoginForm} />
              <h3>Password</h3>
              <input type="password" name="password" onChange={handleLoginForm} />
              <br></br>
              <button type="submit">Log in</button>
            </form>
          </div>
          <Link to={'/'}>Home</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginComponent