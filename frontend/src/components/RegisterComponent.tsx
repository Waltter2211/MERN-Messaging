import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { registerService } from "../services/registerService"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterComponent = () => {

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
      <div className="landingPageBackgroundOverlay">
        <div className="landingPageSelection">
          <h2>Register</h2>
          <div className="form-div">
            <form onSubmit={handleRegister}>
              <h3>Name</h3>
              <input type="text" name="name" onChange={handleRegisterForm} value={registerCreds.name} />
              <h3>Email</h3>
              <input type="email" name="email" onChange={handleRegisterForm} value={registerCreds.email} />
              <h3>Password</h3>
              <input type="password" name="password" onChange={handleRegisterForm} value={registerCreds.password} />
              <br></br>
              <button type="submit">Register</button>
            </form>
          </div>
          <Link to={'/'}>Home</Link>
        </div>
      </div>
    </div>
    </>
    
  )
}

export default RegisterComponent