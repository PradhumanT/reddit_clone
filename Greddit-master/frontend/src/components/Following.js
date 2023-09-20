import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import jwt from 'jwt-decode' // import dependency
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithAuth from './WithAuth';

const Following = () => {

    const [followings, setfollowings] = useState([])

    const removefollowing = async(following) => {
        console.log(following)
        var token = localStorage.getItem("token")
        var userdata = jwt(token)
        const res = await fetch('http://localhost:3001/api/removefollowing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({
                    following:following,
                    followee:userdata.username
                })// body data type must match "Content-Type" header
        })
        let resp = await res.json();
        // console.log(resp.Usertoken)
        localStorage.setItem("token", resp.Usertoken)

        setTimeout(() => {
            toast.success("Unfollowed Successfully")
        }, 1000);
        setTimeout(()=>{
            window.location.reload()
        },1000)
    }

    useEffect(() => {

        const fetchfollowing = async () => {
            let usertoken = localStorage.getItem("token")
            const userdata = jwt(usertoken)

            const res = await fetch('http://localhost:3001/api/getfollowing', {
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({ username: userdata.username })// body data type must match "Content-Type" header
            })
            let resp = await res.json()
            setfollowings(resp)
        }
        fetchfollowing()
    }, [])

    console.log(followings)

    return (
        <section class="text-gray-600 body-font">
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
            <div class="container px-5 py-24 mx-auto">
                <div class="flex flex-col text-center w-full mb-20">
                    <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">My Following</h1>
                    <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
                </div>
                <div class="flex flex-wrap -m-2">
                    {followings.map((following) => {
                        return(
                        <div class="p-2 lg:w-1/3 md:w-1/2 w-full">
                            <div class="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                                <img alt="team" class="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4" src="https://dummyimage.com/80x80" />
                                <Link to={`/otherprofile?username=${following.fusername}`} class="flex-grow">
                                    <h2 class="text-gray-900 title-font font-medium">{following.firstname} {following.lastname}</h2>
                                    <p class="text-gray-500">{following.fusername}</p>
                                </Link>
                                <button onClick={()=>{removefollowing(following.fusername)}} className="text-red-500 hover:bg-gray-200  font-bold py-2 px-4 border border-b-slate-200 rounded-full">
                                        Unfollow
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

export default WithAuth(Following);