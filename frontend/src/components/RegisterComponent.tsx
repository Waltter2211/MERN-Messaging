import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerService } from "../services/registerService"

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyError } from "../services/toastifyService";

const RegisterComponent = () => {

  const navigate = useNavigate()

  const [registerCreds, setRegisterCreds] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleRegister = async (event:React.FormEvent) => {
    event.preventDefault()

    const userObj = {
      name: registerCreds.name,
      email: registerCreds.email,
      password: registerCreds.password
    }

    const userCreds = await registerService(userObj)
    console.log(userCreds)
    if (userCreds.status === 401) {
      console.log("display duplicate user error message")
      notifyError(userCreds.message)
    } else {
      navigate('/login')
    }
  }

  const handleRegisterForm = (event:React.ChangeEvent<HTMLInputElement>) => {
    setRegisterCreds((prev) => {
      return {...prev, [event.target.name]: event.target.value}
    })
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
            <h3>Create Account</h3>
            <p>Start messaging with friends and family</p>
          </div>
          <div className="form-div">
            <form onSubmit={handleRegister}>
              <h3>Name</h3>
              <input type="text" placeholder="John Doe" required={true} minLength={3} name="name" onChange={handleRegisterForm} value={registerCreds.name} />
              <h3>Email</h3>
              <input type="email" placeholder="you@example.com" required={true} minLength={5} name="email" onChange={handleRegisterForm} value={registerCreds.email} />
              <h3>Password</h3>
              <input type="password" placeholder="********" required={true} minLength={3} name="password" onChange={handleRegisterForm} value={registerCreds.password} />
              <br></br>
              <button data-testid="test-register-btn" type="submit">Create Account</button>
            </form>
          </div>
          <p>Already have an account? <span onClick={() => navigate('/')}>Sign in</span></p>
        </div>
      </div>
    </>
  )
}

export default RegisterComponent