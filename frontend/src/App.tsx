import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import NotFoundComponent from './components/NotFoundComponent'
import LandingPageComponent from './components/LandingPageComponent'
import LoginComponent from './components/LoginComponent'
import RegisterComponent from './components/RegisterComponent'
import ProfilePageComponent from './components/ProfilePageComponent'

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPageComponent />} />
        <Route path='/login' element={<LoginComponent />} />
        <Route path='/register' element={<RegisterComponent />} />
        <Route path='/profile' element={<ProfilePageComponent />} />
        <Route path='*' element={<NotFoundComponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App