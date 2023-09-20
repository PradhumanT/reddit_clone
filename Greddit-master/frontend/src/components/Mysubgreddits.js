import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import jwt from 'jwt-decode' // import dependency
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import WithAuth from './WithAuth';

const Manysubgreddits = () => {

    let navigate = useNavigate();
    const [mysubgreddits, setmysubgreddits] = useState([])

    useEffect(() => {

        const fetchdata = async () => {
            let usertoken = localStorage.getItem("token");
            let userdata = jwt(usertoken);

            let res = await fetch('http://localhost:3001/api/getmysubgreddits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({ username: userdata.username })// body data type must match "Content-Type" header
            })
            let resp = await res.json()
            if (resp.error) {
                toast.error(resp.error)
            }
            else {
                setmysubgreddits(jwt(resp.token).mysubgredits)
            }
        }
        fetchdata()
    }, [mysubgreddits])

    const deletesubgreddit = async (pageid) => {
        // let usertoken = localStorage.getItem("token");
        // let userdata = jwt(usertoken);

        let res = await fetch('http://localhost:3001/api/deletesubgreddit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ pageid: pageid })// body data type must match "Content-Type" header
        })
        let resp = await res.json()
        if (resp.error) {
            toast.error(resp.error)
        }
        else {
            setTimeout(() => {
                toast.success("Subgreddit Deleted Successfully")
            },2000);
        }
    }

    // console.log(mysubgreddits)
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
                <div className="flex flex-wrap -m-4">

                    {mysubgreddits.map((subgreddit) => {
                        return (
                            <div key={subgreddit.PageId} className="p-4 lg:w-1/3">
                                <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                                    <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{subgreddit.Tags}</h2>
                                    <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">{subgreddit.Name}</h1>
                                    <p className="leading-relaxed mb-3">{subgreddit.Description}</p>
                                    <h3>Banned Keywords</h3>
                                    <p className="leading-relaxed mb-3 text-red-600">{subgreddit.Banned_keywords}</p>
                                    <Link to={`/subgreddit?${subgreddit.PageId}`} className="text-indigo-500 inline-flex items-center">Learn More
                                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M5 12h14"></path>
                                            <path d="M12 5l7 7-7 7"></path>
                                        </svg>
                                    </Link>

                                    <button onClick={() => deletesubgreddit(subgreddit.PageId)} className="flex mx-auto mt-16 text-white bg-red-500 border-0 py-2 px-8 w-1/3 focus:outline-none hover:bg-red-600 rounded text-lg">Delete</button>

                                    <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                                        <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                                            <svg className="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>{subgreddit.numfollowers} followers
                                        </span>
                                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                                            <svg className="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                            </svg>{subgreddit.numposts} posts
                                        </span>
                                    </div>
                                </div>
                            </div>
                    )
                    })}



                
            </div>
            <button onClick={() => { navigate('/createsubgreddit') }} className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Create More</button>
        </div>
        </section >
    )
}

export default WithAuth(Manysubgreddits);