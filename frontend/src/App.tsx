import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NotFoundComponent from './components/NotFoundComponent'
import LandingPageComponent from './components/LandingPageComponent'
import LoginComponent from './components/LoginComponent'
import RegisterComponent from './components/RegisterComponent'
import ProfilePageComponent from './components/ProfilePageComponent'
import { useEffect, useState } from 'react'
import { UserContext } from './utils/UserContext'
import { QueryClient, QueryClientProvider } from 'react-query'

const App = () => {

  const queryClient = new QueryClient()

  const [loggedInUser, setLoggedInUser] = useState({
    name: '',
    email: '',
    sessionToken: ''
  })

  useEffect(() => {
    const localStrorageUserEmailObj = localStorage.getItem('email')
    const localStrorageUserTokenObj = localStorage.getItem('token')
    if (localStrorageUserEmailObj && localStrorageUserTokenObj) {
      setLoggedInUser({name: '', email: localStrorageUserEmailObj, sessionToken: localStrorageUserTokenObj})
    } else {
      setLoggedInUser({name: '', email: '', sessionToken: ''})
      localStorage.clear()
    }
  }, [])
  
  /* console.log(loggedInUser) */

  return (
    <QueryClientProvider client={queryClient}>
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={loggedInUser.sessionToken.length === 0 ? <LandingPageComponent /> : <ProfilePageComponent />} />
          <Route path='/login' element={loggedInUser.sessionToken.length === 0 ? <LoginComponent /> : <ProfilePageComponent />} />
          <Route path='/register' element={loggedInUser.sessionToken.length === 0 ? <RegisterComponent /> : <ProfilePageComponent />} />
          <Route path='/profile' element={loggedInUser.sessionToken.length === 0 ? <LandingPageComponent /> : <ProfilePageComponent />} />
          <Route path='*' element={<NotFoundComponent />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
    </QueryClientProvider>
  )
}

export default App