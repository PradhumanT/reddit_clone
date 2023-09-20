import React from 'react'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';
import jwt from 'jwt-decode' // import dependency
import WithAuth from './WithAuth';

const Otherprofile = () => {

    let location = useLocation();
    const [profiledata, setprofiledata] = useState({})
    useEffect(() => {

        const fetchprofile = async () => {
            let username = (location.search).slice(10)
            let res = await fetch('http://localhost:3001/api/fetchprofile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({ username: username })// body data type must match "Content-Type" header
            })
            let resp = await res.json();
            let data = jwt(resp.token);
            setprofiledata(data);
        }
        fetchprofile()
    }, [])

    const follow = async (whotofollow) => {
        let usertoken = localStorage.getItem("token");
        let userdata = jwt(usertoken);
        let res = await fetch('http://localhost:3001/api/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ user: userdata.username, whotofollow: whotofollow })// body data type must match "Content-Type" header
        })
        let resp = await res.json();
        localStorage.setItem("token", resp.token)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    return (
        <section class="text-gray-600 body-font">

            <div class="container px-5 py-24 mx-auto">
                <div class="flex flex-col text-center w-full mb-20">
                    <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{profiledata.firstname} {profiledata.lastname}  !! </h1>
                    <p class="lg:w-2/3 mx-auto leading-relaxed text-base">Yes , we have your data , hope its not too important . Welcome to Greddit , a reddit clone for all your dank memes and software updates . Any malicious content will be reported and you will be banished from reddit</p>
                </div>
                <div class="flex flex-col text-center w-full mb-20 ">
                    <div class="bg-white p-3 shadow-sm rounded-sm">
                        <div class="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                            <span clas="text-green-500">
                                <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </span>
                            <span class="tracking-wide">About</span>
                        </div>
                        <div class="text-gray-700">
                            <div class="grid md:grid-cols-2 text-sm">
                                <div class="grid grid-cols-2">
                                    <div class="px-4 py-2 font-semibold">First Name</div>
                                    <div class="px-4 py-2">{profiledata.firstname} </div>

                                </div>
                                <div class="grid grid-cols-2">
                                    <div class="px-4 py-2 font-semibold">Last Name</div>
                                    <div class="px-4 py-2">{profiledata.lastname} </div>

                                </div>
                                <div class="grid grid-cols-2">
                                    <div class="px-4 py-2 font-semibold">User Name</div>
                                    <div class="px-4 py-2">{profiledata.username} </div>

                                </div>
                                <div class="grid grid-cols-2">
                                    <div class="px-4 py-2 font-semibold">Contact No.</div>
                                    <div class="px-4 py-2">{profiledata.contactno} </div>

                                </div>


                                <div class="grid grid-cols-2">
                                    <div class="px-4 py-2 font-semibold">Email.</div>
                                    <div class="px-4 py-2">{profiledata.email} </div>

                                </div>
                                <div class="grid grid-cols-2">
                                    <div class="px-4 py-2 font-semibold">Age</div>
                                    <div class="px-4 py-2">{profiledata.age} </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => { follow(profiledata.username) }} class="flex text-white bg-indigo-500 text-center border-0 py-2 px-6 w-[8%]  focus:outline-none hover:bg-indigo-600 rounded">Follow</button>

                </div>

                <div class="flex flex-wrap -m-4 text-center">

                    <button class="p-4 md:w-1/4 sm:w-1/2 m-auto w-full ">
                        <div class="border-2 border-gray-200 px-4 py-6 rounded-lg hover:bg-gray-300">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75"></path>
                            </svg>
                            <h2 class="title-font font-medium text-3xl text-gray-900">{profiledata.numfollowers} </h2>
                            <p class="leading-relaxed">Followers</p>
                        </div>
                    </button>
                    <button class="p-4 md:w-1/4 sm:w-1/2 w-full m-auto">
                        <div class="border-2 border-gray-200 px-4 py-6 rounded-lg hover:bg-gray-300">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="text-indigo-500 w-12 h-12 mb-3 inline-block" viewBox="0 0 24 24">
                                <path d="M3 18v-6a9 9 0 0118 0v6"></path>
                                <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"></path>
                            </svg>
                            <h2 class="title-font font-medium text-3xl text-gray-900">{profiledata.numfollowing}</h2>
                            <p class="leading-relaxed">Following</p>
                        </div>
                    </button>

                </div>
            </div>
        </section>
    )
}

export default WithAuth(Otherprofile);