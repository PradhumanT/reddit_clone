import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")

    const change = (e) => {
        if (e.target.name === "username")
            setusername(e.target.value)
        if (e.target.name === "password")
            setpassword(e.target.value)
    }

    const onlogin = async () => {

        if (localStorage.getItem("token"))
            return

        const datatosend = { username, password }
        const res = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify(datatosend)// body data type must match "Content-Type" header
        })
        let response = await res.json()
        if (response.error)
            toast.error(response.error)
        else {
            console.log(response.token)
            localStorage.setItem('token', response.token);
            setusername("")
            setpassword("")
            toast.success("You are Successfully logged in")
            setTimeout(() => {
                navigate("/");
            }, 2000);           
        }
    }

    return (
        <div className="bg-grey-lighter min-h-screen flex flex-col">
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
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Log In</h1>
                    <input
                        onChange={change}
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="username"
                        placeholder="Username" />

                    <input
                        onChange={change}
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        name="password"
                        placeholder="Password" />
                    <button
                        onClick={onlogin}
                        type="submit"
                        className="w-full text-center py-3 rounded bg-green-600 text-blue-700 hover:bg-green-dark focus:outline-none my-1"
                    >Log In</button>

                    <div className="text-center text-sm text-grey-dark mt-4">
                        By logging in, you agree to the
                        <a className="no-underline border-b border-grey-dark text-blue-600" href="#">
                            Terms of Service
                        </a> and
                        <a className="no-underline border-b border-grey-dark text-blue-600" href="#">
                            Privacy Policy
                        </a>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Login