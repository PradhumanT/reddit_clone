import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Login';
import Profile from './Profile';
import Signup from './Signup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithAuth from './WithAuth';
import { useNavigate } from 'react-router-dom';
import {AiOutlineLink} from 'react-icons/ai'

const Navbar = () => {

  let location = useLocation();
  let navigate = useNavigate();

  let defLinks = [{
    linkto:'/mysubgreddits',
    title:"My Subgreddits"
  },{
    linkto:'/profile',
    title:"Profile"
  },{
    linkto:'/savedposts',
    title:"Saved Posts"
  },{
    linkto:'/',
    title:"Subgreddits Page"
  }]

  let newlinks = [{
    linkto:`/subgreddit/submembers${location.search}`,
    title:'Users'
  },{
    linkto:`/subgreddit/subrequests${location.search}`,
    title:'Join requests'
  },{
    linkto:`/subgreddit/stats${location.search}`,
    title:'Stats'
  },{
    linkto:`/subgreddit/reports${location.search}`,
    title:'Reports'
  }]

  // const [path, setpath] = useState('')
  const [user, setuser] = useState({ value: null })
  const [links ,setlinks] = useState(defLinks)

  const logout = () => {
    localStorage.removeItem('token')
    setuser({ value: null })
    toast.success("You are Successfully logged Out")
    navigate('/auth?mode=login')
  }

  
  // setpath(location.pathname)

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (token) {
      setuser({ value: token })
    }
    console.log((location.pathname).substring(0,11))
    if((location.pathname).substring(0,11) === '/subgreddit')
      setlinks(newlinks)
    else
      setlinks(defLinks)
  }, [location])

  console.log(links)
  return (

    <header className="text-gray-600 body-font">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link to={'/'}>
          <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">Greddit</span>
          </div>
        </Link>
        <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
          {links && links.map((link , index) => {
            return (
              <Link to={link.linkto} key={index} className="mr-5 hover:text-blue-600">
                <AiOutlineLink className='text-4xl' />
                {link.title}
                </Link>
            )
          })}
          {!links && <>
            <Link to={'/mysubgreddits'} className="mr-5 hover:text-blue-600">My Subgreddits</Link>
            <Link className="mr-5 hover:text-blue-600">Other Links</Link>
            <Link className="mr-5 hover:text-blue-600">Other Links</Link>
            <Link className="mr-5 hover:text-blue-600">Other Links</Link>
          </>
          }
        </nav>
        {/* <Link to={'/signup'}> */}
        {!user.value && <Link to="/auth?mode=signup"> <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Sign Up
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button> </Link>}
        {!user.value && <Link to="/auth?mode=login"> <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Login
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button> </Link>}
        {user.value && <button onClick={logout} className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Logout
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>}
      </div>
    </header>
  )

}


export default Navbar