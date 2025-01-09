import React, { useState, useRef, useEffect } from 'react'
import './styles/Login.scss'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Loading from './Loading'
import { useCookies } from 'react-cookie'
import {FcGoogle} from "react-icons/fc"
import {FaFacebook,FaXTwitter} from "react-icons/fa6"
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs"

function Login() {

  // Variables & React Hooke Declarations 
  const [after, setAfter] = useState<boolean>(true)
  const [loadingAfter, setLoadingAfter] = useState<boolean>(true)
  const [showPassword, setShowPassword] = React.useState<string>('password')
  const [loginValidator, setLoginValidator] = useState<boolean>(false)
  const [_, setCookie ] = useCookies(['token'])
  const [emailSuccess, setEmailSuccess] = useState<string>('unknown')
  const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 500, y: 500 })
  const message = useRef<HTMLDivElement | null>(null)
  const [loginProcess, setLoginProcess] = React.useState<Boolean>(true)

  // button message on hover
  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX+10, y: e.clientY+10 })
  }
  useEffect(() => {
    if (isHovered){
      document.addEventListener('mousemove', handleMouseMove)
      if (message.current) {
        message.current.style.display = 'block'
      }
    }else {
      document.removeEventListener('mousemove', handleMouseMove)
      if (message.current) {
        message.current.style.display = 'none'
      }
      }
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [isHovered])

  // password Toggle Function
  const togglePasswordVisibility = () => {
    const passwordElements = document.getElementsByClassName('LShow') as HTMLCollectionOf<HTMLInputElement>
    setShowPassword(showPassword === 'text'? 'password' : 'text')
    for (let i = 0; i < passwordElements.length; i++) {
      const password = passwordElements[i]
      if (password) {
        if (showPassword === 'password') {
          password.style.backgroundColor = 'rgba(0, 0, 0, 1)'
          password.style.color = 'rgba(233, 233, 233, 1)'
        } else {
          password.style.backgroundColor = 'rgba(233, 233, 233, 1)'
          password.style.color = 'rgba(0, 0, 0, 1)'
        }
      }
    }
  }

  // Interface for Form Data
  interface FormData {
    userName: string
    password: string
  }
    
  // For Submit Function for Form Data
  const submit = async (event: any): Promise<void> => {
    event.preventDefault()
    document.body.style.cursor = "wait"
    setLoginProcess(false)
    const loginData: FormData = {
      userName: event.target[0].value,
      password: event.target[1].value
    }
    if(validation(loginData)){
      if(await send(loginData)){
        setAfter(false)
        setLoginProcess(true)
        await sleep(6000)
        setEmailSuccess(loginData.userName)
        setLoadingAfter(false)
      }
      setLoginValidator(true)
      setLoginProcess(true)
      document.body.style.cursor = "default"
    }else {
      setLoginValidator(true)
      setLoginProcess(true)
      document.body.style.cursor = "default"
    }
  }

  // Input validation function
  function validation(loginData: any): boolean { 
    const passwordPattern = /^.{8,}$/
    if(loginData.userName.length < 2){
      return false
    }else if(!passwordPattern.test(loginData.password)){
      return false
    }else {
      return true
    }
  }

  // Login Api Call
  async function send(loginData: FormData){
    try{
      let response = await axios.post('http://localhost:8888/login',loginData)
      if(response.status === 200){
        setCookie('token', response.data,{ path: '/', expires: new Date(Date.now() + 1000 * 60 * 60 * 24) })
        return true
      }else
        return false
    }catch(e: any){
      if(e.message == "Network Error"){
        alert("Server is Not Working, please try again later....!")
        return false
      }
      return false
    }
  }

  return (
    // Login Page Html Code
    <>
      {after?
        <div className='Login'>
          <div className='LoginBanner'>
              <form className='LoginForm' onSubmit={submit}>
                <h1>Hi, welcome back!</h1>
                <input type="text" placeholder=' Enter the UserName'/>
                <div className='showPassword LShow'>
                  <input className='LShow' type={showPassword} placeholder=' Enter the Password'/>
                  <h5 className='LShow' onClick={togglePasswordVisibility}>{showPassword == 'password'?<BsFillEyeSlashFill/>:<BsFillEyeFill/>}</h5>
                </div>
                <h2>Forget Your Password ?</h2>
                {loginValidator?<h5>username and Password Wrong...</h5>:<></>}
                <button className='SignIn' type='submit' style={{pointerEvents: `${loginProcess?'fill':'none'}`}}>{loginProcess?'Log In':'Please Wait ...'}</button>
                <span>OR</span>
                <button className='SignG' onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}><h3><FcGoogle /></h3>Continue With Google </button>
                <button className='SignF' onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}><h3><FaFacebook /></h3>Continue With FaceBook </button>
                <button className='SignT' onMouseEnter={()=>setIsHovered(true)} onMouseLeave={()=>setIsHovered(false)}><h3><FaXTwitter /></h3>Continue With X </button>
                <span>Don't have the Account ?<Link className='a' to='/register'>Click Here</Link></span>
                <p>By continuing, you agree to Template <span className='LoginSpan'> Terms of Service </span>an acknowledge you've read our <span className='LoginSpan'> Privacy Policy</span></p>
              </form>
            </div>
        {/* Loading page for Login page */}
        </div>:loadingAfter? <Loading/>:
        // That is thankyou page for Login page
        <div className='LoginSuccess'>
          <svg width="371" height="122" viewBox="0 0 371 122" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75.008 33.784C75.008 39.224 73.6 44.216 70.784 48.76C67.968 53.304 63.872 57.016 58.496 59.896C53.12 62.776 46.72 64.472 39.296 64.984L35.168 88.12C33.568 97.016 29.216 101.464 22.112 101.464C18.208 101.464 14.592 100.312 11.264 98.008C8 95.704 5.376 92.184 3.392 87.448C1.408 82.712 0.416 76.888 0.416 69.976C0.416 56.984 2.496 45.976 6.656 36.952C10.88 27.864 16.512 21.08 23.552 16.6C30.656 12.056 38.464 9.784 46.976 9.784C52.992 9.784 58.08 10.84 62.24 12.952C66.464 15.064 69.632 17.944 71.744 21.592C73.92 25.176 75.008 29.24 75.008 33.784ZM41.024 55.096C54.144 53.432 60.704 46.616 60.704 34.648C60.704 30.424 59.296 27 56.48 24.376C53.728 21.688 49.44 20.344 43.616 20.344C37.024 20.344 31.264 22.424 26.336 26.584C21.472 30.744 17.696 36.536 15.008 43.96C12.384 51.32 11.072 59.736 11.072 69.208C11.072 73.176 11.456 76.696 12.224 79.768C13.056 82.84 14.08 85.24 15.296 86.968C16.576 88.632 17.792 89.464 18.944 89.464C20.544 89.464 21.76 87.256 22.592 82.84L25.76 64.696C23.264 64.312 22.176 64.152 22.496 64.216C20.576 63.896 19.328 63.32 18.752 62.488C18.176 61.592 17.888 60.472 17.888 59.128C17.888 57.72 18.272 56.6 19.04 55.768C19.872 54.936 20.992 54.52 22.4 54.52C23.04 54.52 23.52 54.552 23.84 54.616C25.376 54.872 26.56 55.032 27.392 55.096C28.224 50.104 29.408 43.416 30.944 35.032C31.328 32.856 32.192 31.32 33.536 30.424C34.944 29.464 36.576 28.984 38.432 28.984C40.544 28.984 42.048 29.4 42.944 30.232C43.904 31 44.384 32.248 44.384 33.976C44.384 35 44.32 35.832 44.192 36.472L41.024 55.096ZM122.037 61.528C122.869 61.528 123.509 61.944 123.957 62.776C124.405 63.608 124.629 64.664 124.629 65.944C124.629 69.016 123.701 70.84 121.845 71.416C118.005 72.76 113.781 73.528 109.173 73.72C107.957 79.096 105.557 83.416 101.973 86.68C98.3888 89.88 94.3248 91.48 89.7808 91.48C85.9408 91.48 82.6448 90.552 79.8928 88.696C77.2048 86.84 75.1568 84.376 73.7488 81.304C72.3408 78.232 71.6367 74.904 71.6367 71.32C71.6367 66.456 72.5648 62.136 74.4208 58.36C76.2768 54.52 78.8368 51.544 82.1008 49.432C85.3648 47.256 88.9808 46.168 92.9488 46.168C97.8128 46.168 101.717 47.864 104.661 51.256C107.669 54.584 109.429 58.712 109.941 63.64C112.949 63.448 116.533 62.808 120.693 61.72C121.205 61.592 121.653 61.528 122.037 61.528ZM90.5488 81.304C92.5968 81.304 94.3568 80.472 95.8288 78.808C97.3648 77.144 98.3888 74.744 98.9008 71.608C96.9168 70.264 95.3808 68.504 94.2928 66.328C93.2688 64.152 92.7568 61.848 92.7568 59.416C92.7568 58.392 92.8528 57.368 93.0448 56.344H92.5648C90.0048 56.344 87.8608 57.592 86.1328 60.088C84.4688 62.52 83.6368 65.976 83.6368 70.456C83.6368 73.976 84.3088 76.664 85.6528 78.52C87.0608 80.376 88.6928 81.304 90.5488 81.304ZM155.173 59.416C156.581 59.416 157.765 59.928 158.725 60.952C159.749 61.912 160.261 63.128 160.261 64.6C160.261 65.432 160.069 66.328 159.685 67.288C158.661 69.656 157.221 71.64 155.365 73.24C153.509 74.84 151.461 75.64 149.221 75.64C147.429 75.64 145.893 75 144.613 73.72C143.397 72.44 142.789 70.712 142.789 68.536C142.789 67.32 142.853 66.008 142.981 64.6C143.109 63.576 143.173 62.872 143.173 62.488C143.173 61.976 143.045 61.592 142.789 61.336C142.597 61.08 142.341 60.952 142.021 60.952C141.125 60.952 139.909 62.04 138.373 64.216C136.837 66.328 135.301 69.144 133.765 72.664C132.229 76.184 130.981 79.896 130.021 83.8C129.317 86.872 128.517 88.92 127.621 89.944C126.725 90.968 125.253 91.48 123.205 91.48C120.773 91.48 119.045 90.2 118.021 87.64C117.061 85.08 116.581 80.984 116.581 75.352C116.581 67.032 117.765 59.128 120.133 51.64C120.709 49.784 121.637 48.44 122.917 47.608C124.261 46.712 126.117 46.264 128.485 46.264C129.765 46.264 130.661 46.424 131.173 46.744C131.685 47.064 131.941 47.672 131.941 48.568C131.941 49.592 131.461 51.896 130.501 55.48C129.861 58.04 129.349 60.28 128.965 62.2C128.581 64.12 128.261 66.488 128.005 69.304C130.117 63.8 132.485 59.32 135.109 55.864C137.733 52.408 140.293 49.944 142.789 48.472C145.285 47 147.557 46.264 149.605 46.264C151.461 46.264 152.869 46.808 153.829 47.896C154.853 48.92 155.365 50.456 155.365 52.504C155.365 53.72 155.013 56.024 154.309 59.416H155.173ZM206.737 69.592C207.569 69.592 208.209 69.976 208.656 70.744C209.169 71.512 209.425 72.568 209.425 73.912C209.425 76.472 208.817 78.456 207.601 79.864C204.849 83.256 201.841 86.04 198.577 88.216C195.313 90.392 191.569 91.48 187.345 91.48C174.289 91.48 167.761 82.296 167.761 63.928C167.761 61.112 167.857 58.264 168.049 55.384H164.305C162.385 55.384 161.073 55.032 160.369 54.328C159.729 53.624 159.409 52.504 159.409 50.968C159.409 47.384 160.849 45.592 163.729 45.592H169.201C170.289 38.552 171.953 32.12 174.193 26.296C176.433 20.472 179.121 15.832 182.257 12.376C185.457 8.92 188.881 7.192 192.529 7.192C195.217 7.192 197.329 8.376 198.865 10.744C200.401 13.112 201.169 16.088 201.169 19.672C201.169 29.592 197.009 38.232 188.689 45.592H199.441C200.465 45.592 201.201 45.816 201.649 46.264C202.097 46.712 202.321 47.544 202.321 48.76C202.321 53.176 198.705 55.384 191.473 55.384H179.761C179.633 58.584 179.569 61.08 179.569 62.872C179.569 69.528 180.337 74.2 181.873 76.888C183.473 79.576 185.969 80.92 189.361 80.92C192.113 80.92 194.545 80.088 196.657 78.424C198.769 76.76 201.265 74.264 204.145 70.936C204.913 70.04 205.777 69.592 206.737 69.592ZM189.937 16.408C188.977 16.408 187.889 17.624 186.673 20.056C185.521 22.424 184.401 25.752 183.312 30.04C182.289 34.264 181.425 38.968 180.721 44.152C184.497 40.888 187.313 37.24 189.169 33.208C191.089 29.112 192.049 25.4 192.049 22.072C192.049 18.296 191.345 16.408 189.937 16.408ZM239.912 64.12C241.704 64.12 242.6 65.464 242.6 68.152C242.6 73.208 238.632 75.736 230.696 75.736C229.16 75.736 226.952 75.448 224.072 74.872C224.904 78.84 225.576 83.256 226.088 88.12C226.664 92.92 226.952 96.888 226.952 100.024C226.952 106.936 225.832 112.216 223.592 115.864C221.352 119.512 218.408 121.336 214.76 121.336C210.152 121.336 206.856 118.072 204.872 111.544C202.952 105.016 201.992 95.16 201.992 81.976C201.992 69.688 203.304 57.24 205.928 44.632C208.616 31.96 212.264 21.496 216.872 13.24C221.544 4.91999 226.664 0.759995 232.232 0.759995C235.24 0.759995 237.576 2.10399 239.24 4.79199C240.968 7.47999 241.832 11.096 241.832 15.64C241.832 30.68 232.84 47.064 214.856 64.792C214.216 71.064 213.896 76.568 213.896 81.304C213.896 87.896 214.12 94.648 214.568 101.56C215.016 108.536 215.752 112.024 216.776 112.024C218.696 112.024 219.656 108.696 219.656 102.04C219.656 97.048 219.304 92.216 218.6 87.544C217.96 82.872 217.064 77.944 215.912 72.76C215.848 71.928 216.104 70.872 216.68 69.592C217.32 68.312 218.088 67.192 218.984 66.232C219.88 65.272 220.68 64.792 221.384 64.792C222.664 64.792 224.2 64.856 225.992 64.984C226.568 65.048 227.24 65.08 228.008 65.08C230.568 65.08 233.416 64.856 236.552 64.408C237.064 64.344 237.608 64.28 238.184 64.216C238.76 64.152 239.336 64.12 239.912 64.12ZM230.216 10.264C229.064 10.264 227.624 12.216 225.896 16.12C224.232 20.024 222.568 25.208 220.904 31.672C219.24 38.072 217.8 44.856 216.584 52.024C221.704 46.2 225.64 40.152 228.392 33.88C231.144 27.544 232.552 21.624 232.616 16.12C232.616 12.216 231.816 10.264 230.216 10.264ZM284.318 61.528C285.15 61.528 285.79 61.944 286.238 62.776C286.686 63.608 286.91 64.664 286.91 65.944C286.91 69.016 285.982 70.84 284.126 71.416C280.286 72.76 276.062 73.528 271.454 73.72C270.238 79.096 267.838 83.416 264.254 86.68C260.67 89.88 256.606 91.48 252.062 91.48C248.222 91.48 244.926 90.552 242.174 88.696C239.486 86.84 237.438 84.376 236.03 81.304C234.622 78.232 233.918 74.904 233.918 71.32C233.918 66.456 234.846 62.136 236.702 58.36C238.558 54.52 241.118 51.544 244.382 49.432C247.646 47.256 251.262 46.168 255.23 46.168C260.094 46.168 263.998 47.864 266.942 51.256C269.95 54.584 271.71 58.712 272.222 63.64C275.23 63.448 278.814 62.808 282.974 61.72C283.486 61.592 283.934 61.528 284.318 61.528ZM252.83 81.304C254.878 81.304 256.638 80.472 258.11 78.808C259.646 77.144 260.67 74.744 261.182 71.608C259.198 70.264 257.662 68.504 256.574 66.328C255.55 64.152 255.038 61.848 255.038 59.416C255.038 58.392 255.134 57.368 255.326 56.344H254.846C252.286 56.344 250.142 57.592 248.414 60.088C246.75 62.52 245.918 65.976 245.918 70.456C245.918 73.976 246.59 76.664 247.934 78.52C249.342 80.376 250.974 81.304 252.83 81.304ZM315.055 69.592C315.887 69.592 316.527 69.976 316.975 70.744C317.487 71.512 317.743 72.568 317.743 73.912C317.743 76.472 317.135 78.456 315.919 79.864C313.167 83.256 310.159 86.04 306.895 88.216C303.695 90.392 300.047 91.48 295.951 91.48C290.319 91.48 286.127 88.92 283.375 83.8C280.687 78.68 279.343 72.056 279.343 63.928C279.343 56.12 280.335 47.224 282.319 37.24C284.367 27.256 287.343 18.68 291.247 11.512C295.215 4.34399 299.919 0.759995 305.359 0.759995C308.431 0.759995 310.831 2.2 312.559 5.08C314.351 7.896 315.247 11.96 315.247 17.272C315.247 24.888 313.135 33.72 308.911 43.768C304.687 53.816 298.959 63.768 291.727 73.624C292.175 76.248 292.911 78.136 293.935 79.288C294.959 80.376 296.303 80.92 297.967 80.92C300.591 80.92 302.895 80.184 304.879 78.712C306.863 77.176 309.391 74.584 312.463 70.936C313.231 70.04 314.095 69.592 315.055 69.592ZM303.247 10.264C301.775 10.264 300.111 12.92 298.255 18.232C296.399 23.544 294.767 30.136 293.359 38.008C291.951 45.88 291.183 53.432 291.055 60.664C295.599 53.176 299.215 45.688 301.903 38.2C304.591 30.648 305.935 23.768 305.935 17.56C305.935 12.696 305.039 10.264 303.247 10.264ZM322.559 39.928C319.871 39.928 317.855 39.32 316.511 38.104C315.167 36.824 314.495 35.064 314.495 32.824C314.495 30.584 315.359 28.728 317.087 27.256C318.879 25.72 321.087 24.952 323.711 24.952C326.079 24.952 327.999 25.528 329.471 26.68C330.943 27.832 331.679 29.464 331.679 31.576C331.679 34.136 330.847 36.184 329.183 37.72C327.519 39.192 325.311 39.928 322.559 39.928ZM321.791 91.48C317.631 91.48 314.591 90.008 312.671 87.064C310.815 84.12 309.887 80.216 309.887 75.352C309.887 72.472 310.239 68.792 310.943 64.312C311.711 59.768 312.671 55.544 313.823 51.64C314.399 49.592 315.167 48.184 316.127 47.416C317.087 46.648 318.623 46.264 320.735 46.264C323.999 46.264 325.631 47.352 325.631 49.528C325.631 51.128 325.023 54.84 323.807 60.664C322.271 67.704 321.503 72.472 321.503 74.968C321.503 76.888 321.759 78.36 322.271 79.384C322.783 80.408 323.647 80.92 324.863 80.92C326.015 80.92 327.455 80.12 329.183 78.52C330.911 76.92 333.215 74.392 336.095 70.936C336.863 70.04 337.727 69.592 338.687 69.592C339.519 69.592 340.159 69.976 340.607 70.744C341.119 71.512 341.375 72.568 341.375 73.912C341.375 76.472 340.767 78.456 339.551 79.864C333.215 87.608 327.295 91.48 321.791 91.48ZM349.832 91.48C346.056 91.48 342.824 90.552 340.136 88.696C337.512 86.776 335.528 84.28 334.184 81.208C332.84 78.136 332.168 74.84 332.168 71.32C332.168 66.456 333.064 62.136 334.856 58.36C336.712 54.52 339.208 51.544 342.344 49.432C345.48 47.256 349 46.168 352.904 46.168C356.68 46.168 359.912 47.128 362.6 49.048C365.288 50.904 367.304 53.368 368.648 56.44C369.992 59.512 370.664 62.808 370.664 66.328C370.664 71.192 369.736 75.544 367.88 79.384C366.024 83.16 363.496 86.136 360.296 88.312C357.16 90.424 353.672 91.48 349.832 91.48ZM350.888 81.112C353.064 81.112 354.888 79.928 356.36 77.56C357.896 75.192 358.664 71.736 358.664 67.192C358.664 63.672 358.024 61.016 356.744 59.224C355.464 57.432 353.928 56.536 352.136 56.536C349.832 56.536 347.912 57.72 346.376 60.088C344.904 62.392 344.168 65.848 344.168 70.456C344.168 74.104 344.808 76.792 346.088 78.52C347.368 80.248 348.968 81.112 350.888 81.112Z" fill="white"/>
          </svg>

          <h2>Hi, {emailSuccess}</h2>
          <Link to={'/'}><button type='button'>Go to Home</button></Link>
        </div>
      }
      <h1 className='Underdevelopment' ref={message} style={{top: mousePosition.y+'px', left: mousePosition.x+'px'}}>Under Development</h1>
    </>
  )
}

export default Login

