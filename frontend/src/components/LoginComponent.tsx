import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { loginService } from "../services/loginService"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from "../utils/UserContext";

const LoginComponent = () => {

  const notifyError = (message:string) => toast.error(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    /* transition: Zoom, */
  });

  const user = useContext(UserContext)

  console.log(user)

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
      localStorage.setItem('email', userCreds.userCredentials.email)
      user.setLoggedInUser({name: '', email: userCreds.userCredentials.email, sessionToken: userCreds.token})
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
      <div className="landingPageBackgroundOverlay">
        <div className="landingPageSelection">
          <h2>Login</h2>
          <div className="form-div">
            <form onSubmit={handleLogin}>
              <h3>Email</h3>
              <input type="email" name="email" onChange={handleLoginForm} value={loginCreds.email} />
              <h3>Password</h3>
              <input type="password" name="password" onChange={handleLoginForm} value={loginCreds.password} />
              <br></br>
              <button type="submit">Log in</button>
            </form>
          </div>
          <Link to={'/'}>Home</Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default LoginComponent