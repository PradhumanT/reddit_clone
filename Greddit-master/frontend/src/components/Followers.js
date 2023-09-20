import React from 'react'
import { useEffect, useState } from 'react'
import {Link, Navigate} from 'react-router-dom'
import jwt from 'jwt-decode' // import dependency
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithAuth from './WithAuth';

const Followers = () => {

    const [followers, setfollowers] = useState([])

    const removefollower = async(follower) => {
        console.log(follower)
        var token = localStorage.getItem("token")
        var userdata = jwt(token)
        const res = await fetch('http://localhost:3001/api/removefollower', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({
                    follower:follower,
                    followee:userdata.username
                })// body data type must match "Content-Type" header
        })
        let resp = res.json();
        localStorage.setItem("token", resp.Usertoken)
        toast.success("Follower Removed Successfully")
    }

    useEffect(() => {

        const fetchfollowers = async () => {
            let usertoken = localStorage.getItem("token")
            const userdata = jwt(usertoken)

            const res = await fetch('http://localhost:3001/api/getfollowers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({ username: userdata.username })// body data type must match "Content-Type" header
            })
            let resp = await res.json()
            setfollowers(resp)
        }
        fetchfollowers()
    }, [])


    if (!followers) {
        return <p>Loading</p>
    }

    return (
        <section className="text-gray-600 body-font">
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
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">My Followers</h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
                </div>
                <div className="flex flex-wrap -m-2">
                    {followers.map((follower) => {
                        return (
                            <div key={follower.fusername} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                                    <img alt="team" className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/80x80" />
                                    
                                    <Link to={`/otherprofile?username=${follower.fusername}`} className="flex-grow">
                                        <h2 className="text-gray-900 title-font font-medium">{follower.firstname} {follower.lastname}</h2>
                                        <p className="text-gray-500">{follower.fusername}</p>
                                    </Link>
                                    <button onClick={()=>{removefollower(follower.fusername)}} className="text-red-500 hover:bg-gray-200  font-bold py-2 px-4 border border-b-slate-200 rounded-full">
                                        Remove
                                    </button>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
        </section>
    )
}

export default WithAuth(Followers);