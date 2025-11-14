import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginService } from "../services/loginService"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../utils/UserContext";
import { notifyError } from "../services/toastifyService";
import socket from "../socket";
import { userService } from "../services/userService";
import { pingHelperFunc } from "../helpers/pingHelper";

const LoginComponent = () => {

  const user = useContext(UserContext)

  /* console.log(user) */

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
    if (userCreds.status === 404) {
      console.log("display not found error message")
      notifyError(userCreds.message)
    }
    else if (userCreds.status === 401) {
      console.log("display incorrect password error message")
      notifyError(userCreds.message)
    }
    else {
      localStorage.setItem('token', userCreds.token)
      user.setLoggedInUser({name: '', email: userCreds.userCredentials.email, sessionToken: userCreds.token})
      socket.auth = { name: userCreds.userCredentials.email }
      socket.connect()
      const userChatrooms = await userService(userCreds.userCredentials.email, userCreds.token)
      pingHelperFunc(userChatrooms.chatRooms, socket)
      navigate('/profile')
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
    <div className="landingPageBackground">
        <div className="landingPageSelection">
          <div className="titleText">
            <img src="/logo.JPG" data-testid="test-register-header"></img>
            <h3>Welcome Back</h3>
            <p>Sign in to continue to your conversations</p>
          </div>
          <div className="form-div">
            <form onSubmit={handleLogin}>
              <h3>Email</h3>
              <input data-testid="test-login-email-input" placeholder="you@example.com" type="email" name="email" onChange={handleLoginForm} value={loginCreds.email} />
              <h3>Password</h3>
              <input data-testid="test-login-password-input" placeholder="********" type="password" name="password" onChange={handleLoginForm} value={loginCreds.password} />
              <br></br>
              <button data-testid="test-login-btn" type="submit">Sign In</button>
            </form>
          </div>
          {/* <Link to={'/register'}>Register</Link> */}
          <p>Don't have an account? <span onClick={() => navigate('/register')}>Sign up</span></p>
        </div>
      </div>
    </>
  )
}

export default LoginComponent