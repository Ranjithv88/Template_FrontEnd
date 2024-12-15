import { Link } from "react-router-dom"

function HomePage() {
  return (
    <>
        <button><Link to={'./Login'}>login</Link></button>
        <button><Link to={'./Register'}>Register</Link></button>
        <button><Link to={'./Loading'}>Loading</Link></button>
    </>
  )
}

export default HomePage

