import './App.css'

const MyButton = ({ buttonText }:{ buttonText:string }) => {
  return (
    <button>{buttonText}</button>
  )
}

const App = () => {

  return (
    <>
      <div>
        <h1>app component</h1>
      </div>
      <MyButton buttonText='testing' />
    </>
  )
}

export default App
