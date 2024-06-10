import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import ProductComponent from './components/ProductComponent'
import ServicesComponent from './components/ServicesComponent'
import NotFoundComponent from './components/NotFoundComponent'
import LandingPageComponent from './components/LandingPageComponent'

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPageComponent />} />
        <Route path='/products' element={<ProductComponent />} />
        <Route path='/services' element={<ServicesComponent />} />
        <Route path='*' element={<NotFoundComponent />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App