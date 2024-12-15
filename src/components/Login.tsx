import React, { useState, useRef, useEffect } from 'react'
import './styles/login.scss'
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
    const loginData: FormData = {
      userName: event.target[0].value,
      password: event.target[1].value
    }
    if(validation(loginData)){
      if(await send(loginData) == true){
        setAfter(false)
        await sleep(6000)
        setEmailSuccess(loginData.userName)
        setLoadingAfter(false)
      }
      setLoginValidator(true)
      document.body.style.cursor = "default"
    }
    setLoginValidator(true)
    document.body.style.cursor = "default"
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
        setCookie('token', response.data,{ path: '/', expires: new Date(Date.now() + 3600 * 1000) })
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
                <button className='SignIn' type='submit' >Log In</button>
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
          <svg width="366" height="135" viewBox="0 0 366 135" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M77.736 11.32C79.72 11.704 81.192 12.376 82.152 13.336C83.176 14.296 83.688 15.416 83.688 16.696C83.688 18.808 83.08 20.344 81.864 21.304C80.712 22.264 78.856 22.648 76.296 22.456C70.536 22.008 66.024 21.72 62.76 21.592C59.56 21.4 55.336 21.272 50.088 21.208C47.72 32.984 45.544 44.824 43.56 56.728C42.856 61.08 42.12 66.136 41.352 71.896C40.584 77.592 40.072 82.2 39.816 85.72C39.688 87.576 38.92 89.016 37.512 90.04C36.104 91 34.408 91.48 32.424 91.48C30.312 91.48 28.68 90.968 27.528 89.944C26.376 88.92 25.8 87.576 25.8 85.912C25.8 84.376 26.024 81.848 26.472 78.328C26.984 74.744 27.56 71 28.2 67.096C28.904 63.192 29.448 59.8 29.832 56.92C30.536 52.056 31.336 47.224 32.232 42.424C33.128 37.624 34.024 33.08 34.92 28.792C35.112 27.832 35.336 26.744 35.592 25.528C35.848 24.248 36.136 22.84 36.456 21.304C30.184 21.496 25.256 22.008 21.672 22.84C18.088 23.672 15.528 24.856 13.992 26.392C12.52 27.864 11.784 29.784 11.784 32.152C11.784 34.328 12.424 36.408 13.704 38.392C13.96 38.84 14.088 39.32 14.088 39.832C14.088 41.048 13.352 42.2 11.88 43.288C10.472 44.312 9 44.824 7.464 44.824C6.376 44.824 5.48 44.504 4.776 43.864C3.496 42.776 2.44 41.24 1.608 39.256C0.776 37.208 0.36 34.904 0.36 32.344C0.36 26.904 2.12 22.552 5.64 19.288C9.224 15.96 14.632 13.528 21.864 11.992C29.16 10.456 38.504 9.68799 49.896 9.68799C56.936 9.68799 62.536 9.81599 66.696 10.072C70.92 10.328 74.6 10.744 77.736 11.32ZM102.737 69.592C103.569 69.592 104.209 69.976 104.656 70.744C105.169 71.512 105.425 72.568 105.425 73.912C105.425 76.472 104.817 78.456 103.601 79.864C101.233 82.744 97.8725 85.4 93.5205 87.832C89.2325 90.264 84.6245 91.48 79.6965 91.48C72.9765 91.48 67.7605 89.656 64.0485 86.008C60.3365 82.36 58.4805 77.368 58.4805 71.032C58.4805 66.616 59.4085 62.52 61.2645 58.744C63.1205 54.904 65.6805 51.864 68.9445 49.624C72.2725 47.384 76.0165 46.264 80.1765 46.264C83.8885 46.264 86.8645 47.384 89.1045 49.624C91.3445 51.8 92.4645 54.776 92.4645 58.552C92.4645 62.968 90.8645 66.776 87.6645 69.976C84.5285 73.112 79.1845 75.608 71.6325 77.464C73.2325 80.408 76.2725 81.88 80.7525 81.88C83.6325 81.88 86.8965 80.888 90.5445 78.904C94.2565 76.856 97.4565 74.2 100.145 70.936C100.913 70.04 101.777 69.592 102.737 69.592ZM78.5445 55.672C76.1765 55.672 74.1605 57.048 72.4965 59.8C70.8965 62.552 70.0965 65.88 70.0965 69.784V69.976C73.8725 69.08 76.8485 67.736 79.0245 65.944C81.2005 64.152 82.2885 62.072 82.2885 59.704C82.2885 58.488 81.9365 57.528 81.2325 56.824C80.5925 56.056 79.6965 55.672 78.5445 55.672ZM104.424 91.48C101.992 91.48 100.264 90.2 99.24 87.64C98.28 85.08 97.8 80.984 97.8 75.352C97.8 67.032 98.984 59.128 101.352 51.64C101.928 49.784 102.856 48.44 104.136 47.608C105.48 46.712 107.336 46.264 109.704 46.264C110.984 46.264 111.88 46.424 112.392 46.744C112.904 47.064 113.16 47.672 113.16 48.568C113.16 49.592 112.68 51.896 111.72 55.48C111.08 58.04 110.568 60.28 110.184 62.2C109.8 64.056 109.48 66.392 109.224 69.208C110.952 64.216 113 59.992 115.368 56.536C117.8 53.08 120.264 50.52 122.76 48.856C125.32 47.128 127.72 46.264 129.96 46.264C132.2 46.264 133.768 46.776 134.664 47.8C135.624 48.824 136.104 50.392 136.104 52.504C136.104 54.552 135.496 58.264 134.28 63.64C133.768 65.944 133.416 67.672 133.224 68.824C136.424 60.952 139.976 55.224 143.88 51.64C147.784 48.056 151.432 46.264 154.824 46.264C158.984 46.264 161.064 48.344 161.064 52.504C161.064 55 160.36 59.512 158.952 66.04C157.736 71.608 157.128 75.288 157.128 77.08C157.128 79.64 158.056 80.92 159.912 80.92C161.192 80.92 162.696 80.152 164.424 78.616C166.216 77.016 168.584 74.456 171.528 70.936C172.296 70.04 173.16 69.592 174.12 69.592C174.952 69.592 175.592 69.976 176.04 70.744C176.552 71.512 176.808 72.568 176.808 73.912C176.808 76.472 176.2 78.456 174.984 79.864C172.232 83.256 169.256 86.04 166.056 88.216C162.92 90.392 159.336 91.48 155.304 91.48C152.04 91.48 149.576 90.552 147.912 88.696C146.248 86.776 145.416 84.024 145.416 80.44C145.416 78.648 145.864 75.448 146.76 70.84C147.592 66.808 148.008 64.024 148.008 62.488C148.008 61.464 147.656 60.952 146.952 60.952C146.12 60.952 144.936 62.04 143.4 64.216C141.864 66.328 140.328 69.144 138.792 72.664C137.256 76.184 136.008 79.896 135.048 83.8C134.344 86.872 133.512 88.92 132.552 89.944C131.656 90.968 130.184 91.48 128.136 91.48C126.024 91.48 124.424 90.488 123.336 88.504C122.312 86.456 121.8 83.992 121.8 81.112C121.8 78.68 122.12 75.16 122.76 70.552C123.272 66.456 123.528 63.768 123.528 62.488C123.528 61.464 123.176 60.952 122.472 60.952C121.512 60.952 120.296 62.104 118.824 64.408C117.352 66.712 115.912 69.656 114.504 73.24C113.16 76.824 112.072 80.344 111.24 83.8C110.536 86.808 109.704 88.856 108.744 89.944C107.848 90.968 106.408 91.48 104.424 91.48ZM220.31 69.592C221.142 69.592 221.782 69.976 222.23 70.744C222.742 71.512 222.998 72.568 222.998 73.912C222.998 76.472 222.39 78.456 221.174 79.864C218.422 83.256 215.446 86.04 212.246 88.216C209.11 90.392 205.526 91.48 201.494 91.48C198.102 91.48 195.35 90.264 193.238 87.832C189.59 90.2 185.782 91.416 181.814 91.48C180.982 103.832 179.094 114.136 176.15 122.392C173.206 130.712 168.886 134.872 163.189 134.872C159.733 134.872 157.173 133.624 155.509 131.128C153.845 128.632 153.013 125.176 153.013 120.76C153.013 114.488 154.453 107.16 157.333 98.776C160.213 90.456 164.662 81.272 170.678 71.224C170.678 61.88 170.614 55.384 170.486 51.736C170.422 49.88 171.158 48.408 172.694 47.32C174.23 46.232 176.15 45.688 178.454 45.688C179.798 45.688 180.758 45.976 181.334 46.552C181.974 47.064 182.326 48.12 182.39 49.72C182.39 51.32 182.422 52.504 182.486 53.272C184.534 50.712 186.55 48.888 188.534 47.8C190.518 46.648 192.63 46.072 194.87 46.072C198.454 46.072 201.366 47.512 203.606 50.392C205.91 53.272 207.062 57.048 207.062 61.72C207.062 65.112 206.518 68.408 205.43 71.608C204.342 74.808 202.838 77.72 200.918 80.344C202.262 80.728 203.382 80.92 204.278 80.92C206.39 80.92 208.406 80.152 210.326 78.616C212.246 77.08 214.71 74.52 217.718 70.936C218.486 70.04 219.35 69.592 220.31 69.592ZM182.294 82.264C184.598 81.752 186.71 80.504 188.63 78.52C190.614 76.472 192.182 73.976 193.334 71.032C194.486 68.024 195.062 64.888 195.062 61.624C195.062 59.704 194.678 58.264 193.91 57.304C193.142 56.28 192.118 55.768 190.838 55.768C188.534 55.768 185.75 58.2 182.486 63.064C182.422 65.88 182.39 70.008 182.39 75.448C182.39 78.392 182.358 80.664 182.294 82.264ZM163.957 125.464C165.686 125.464 167.126 121.688 168.278 114.136C169.43 106.648 170.166 97.304 170.486 86.104C167.734 92.504 165.558 98.616 163.957 104.44C162.357 110.264 161.557 115.16 161.557 119.128C161.557 121.176 161.813 122.744 162.325 123.832C162.773 124.92 163.317 125.464 163.957 125.464ZM251.648 69.592C252.48 69.592 253.12 69.976 253.568 70.744C254.08 71.512 254.336 72.568 254.336 73.912C254.336 76.472 253.728 78.456 252.512 79.864C249.76 83.256 246.752 86.04 243.488 88.216C240.288 90.392 236.64 91.48 232.544 91.48C226.912 91.48 222.72 88.92 219.968 83.8C217.28 78.68 215.936 72.056 215.936 63.928C215.936 56.12 216.928 47.224 218.912 37.24C220.96 27.256 223.936 18.68 227.84 11.512C231.808 4.34399 236.512 0.759995 241.952 0.759995C245.024 0.759995 247.424 2.2 249.152 5.08C250.944 7.896 251.84 11.96 251.84 17.272C251.84 24.888 249.728 33.72 245.504 43.768C241.28 53.816 235.552 63.768 228.32 73.624C228.768 76.248 229.504 78.136 230.528 79.288C231.552 80.376 232.896 80.92 234.56 80.92C237.184 80.92 239.488 80.184 241.472 78.712C243.456 77.176 245.984 74.584 249.056 70.936C249.824 70.04 250.688 69.592 251.648 69.592ZM239.84 10.264C238.368 10.264 236.704 12.92 234.848 18.232C232.992 23.544 231.36 30.136 229.952 38.008C228.544 45.88 227.776 53.432 227.648 60.664C232.192 53.176 235.808 45.688 238.496 38.2C241.184 30.648 242.528 23.768 242.528 17.56C242.528 12.696 241.632 10.264 239.84 10.264ZM257.447 91.48C253.479 91.48 250.311 90.04 247.943 87.16C245.575 84.28 244.391 80.504 244.391 75.832C244.391 70.712 245.575 65.88 247.943 61.336C250.311 56.728 253.447 53.048 257.351 50.296C261.319 47.48 265.511 46.072 269.927 46.072C271.335 46.072 272.263 46.36 272.711 46.936C273.223 47.448 273.639 48.408 273.959 49.816C275.303 49.56 276.711 49.432 278.183 49.432C281.319 49.432 282.887 50.552 282.887 52.792C282.887 54.136 282.407 57.336 281.447 62.392C279.975 69.752 279.239 74.872 279.239 77.752C279.239 78.712 279.463 79.48 279.911 80.056C280.423 80.632 281.063 80.92 281.831 80.92C283.047 80.92 284.519 80.152 286.247 78.616C287.975 77.016 290.311 74.456 293.255 70.936C294.023 70.04 294.887 69.592 295.847 69.592C296.679 69.592 297.319 69.976 297.767 70.744C298.279 71.512 298.535 72.568 298.535 73.912C298.535 76.472 297.927 78.456 296.711 79.864C294.087 83.128 291.303 85.88 288.359 88.12C285.415 90.36 282.567 91.48 279.815 91.48C277.703 91.48 275.751 90.776 273.959 89.368C272.231 87.896 270.919 85.912 270.023 83.416C266.695 88.792 262.503 91.48 257.447 91.48ZM260.903 81.784C262.311 81.784 263.655 80.952 264.935 79.288C266.215 77.624 267.143 75.416 267.719 72.664L271.271 55C268.583 55.064 266.087 56.088 263.783 58.072C261.543 59.992 259.751 62.552 258.407 65.752C257.063 68.952 256.391 72.344 256.391 75.928C256.391 77.912 256.775 79.384 257.543 80.344C258.375 81.304 259.495 81.784 260.903 81.784ZM333.549 69.592C334.381 69.592 335.021 69.976 335.469 70.744C335.981 71.512 336.237 72.568 336.237 73.912C336.237 76.472 335.629 78.456 334.413 79.864C331.661 83.256 328.653 86.04 325.389 88.216C322.125 90.392 318.381 91.48 314.157 91.48C301.101 91.48 294.573 82.296 294.573 63.928C294.573 61.112 294.669 58.264 294.861 55.384H291.117C289.197 55.384 287.885 55.032 287.181 54.328C286.541 53.624 286.221 52.504 286.221 50.968C286.221 47.384 287.661 45.592 290.541 45.592H296.013C297.101 38.552 298.765 32.12 301.005 26.296C303.245 20.472 305.933 15.832 309.069 12.376C312.269 8.92 315.693 7.192 319.341 7.192C322.029 7.192 324.141 8.376 325.677 10.744C327.213 13.112 327.981 16.088 327.981 19.672C327.981 29.592 323.821 38.232 315.501 45.592H326.253C327.277 45.592 328.013 45.816 328.461 46.264C328.909 46.712 329.133 47.544 329.133 48.76C329.133 53.176 325.517 55.384 318.285 55.384H306.573C306.445 58.584 306.381 61.08 306.381 62.872C306.381 69.528 307.149 74.2 308.685 76.888C310.285 79.576 312.781 80.92 316.173 80.92C318.925 80.92 321.357 80.088 323.469 78.424C325.581 76.76 328.077 74.264 330.957 70.936C331.725 70.04 332.589 69.592 333.549 69.592ZM316.749 16.408C315.789 16.408 314.701 17.624 313.485 20.056C312.333 22.424 311.213 25.752 310.125 30.04C309.101 34.264 308.237 38.968 307.533 44.152C311.309 40.888 314.125 37.24 315.981 33.208C317.901 29.112 318.861 25.4 318.861 22.072C318.861 18.296 318.157 16.408 316.749 16.408ZM362.789 72.472C363.621 72.472 364.261 72.856 364.709 73.624C365.221 74.392 365.477 75.448 365.477 76.792C365.477 79.096 364.933 81.08 363.845 82.744C362.053 85.496 359.685 87.64 356.741 89.176C353.861 90.712 350.405 91.48 346.373 91.48C340.229 91.48 335.461 89.656 332.069 86.008C328.677 82.296 326.98 77.304 326.98 71.032C326.98 66.616 327.909 62.52 329.765 58.744C331.621 54.904 334.181 51.864 337.445 49.624C340.773 47.384 344.517 46.264 348.677 46.264C352.389 46.264 355.365 47.384 357.605 49.624C359.845 51.8 360.965 54.776 360.965 58.552C360.965 62.968 359.365 66.776 356.165 69.976C353.029 73.112 347.653 75.608 340.037 77.464C341.573 80.408 344.165 81.88 347.812 81.88C350.437 81.88 352.581 81.272 354.245 80.056C355.973 78.84 357.957 76.792 360.197 73.912C360.965 72.952 361.829 72.472 362.789 72.472ZM347.045 55.672C344.677 55.672 342.661 57.048 340.997 59.8C339.397 62.552 338.597 65.88 338.597 69.784V69.976C342.373 69.08 345.349 67.736 347.525 65.944C349.701 64.152 350.789 62.072 350.789 59.704C350.789 58.488 350.437 57.528 349.733 56.824C349.093 56.056 348.197 55.672 347.045 55.672Z" fill="white"/>
          </svg>
          <h2>hi, {emailSuccess}</h2>
          <button type='button'><Link className='a' to={'/Home'}>go to Home</Link></button>
        </div>
      }
      <h1 className='Underdevelopment' ref={message} style={{top: mousePosition.y+'px', left: mousePosition.x+'px'}}>Under Development</h1>
    </>
  )
}

export default Login

