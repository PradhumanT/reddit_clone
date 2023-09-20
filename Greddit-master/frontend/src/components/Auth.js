import React from 'react'
import Signup from './Signup'
import Login from './Login'
import { Location, useLocation } from 'react-router-dom'

const Auth = () => {
    let location = useLocation()
    console.log(location.search)
    if (location.search === "?mode=signup")
        return <Signup />

    else if (location.search === "?mode=login")
        return <Login />

}

export default Auth