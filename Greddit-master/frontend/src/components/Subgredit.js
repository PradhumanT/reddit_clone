import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import jwt from 'jwt-decode' // import dependency
import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { IoMdThumbsUp, IoMdThumbsDown, IoIosArrowDropdown } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiSaveUp1 } from "react-icons/ci";
import WithAuth from './WithAuth';
import useKeyboardShortcut from 'use-keyboard-shortcut';


const Subgredit = () => {

    let navigate = useNavigate();
    let location = useLocation();

    let usertoken = localStorage.getItem('token');
    let user_username = jwt(usertoken).username;

    const [pagereload, setpagereload] = useState(false);
    const [Subname, setSubname] = useState();
    const [Subdesc, setSubdesc] = useState()
    const [pageid, setpageid] = useState(location.search.slice(1))
    const [posts, setposts] = useState([]);
    const [commentbox, setcommentbox] = useState([]);
    const [showModal, setshowModal] = useState(false)
    const [concern, setconcern] = useState();
    const [postidtoreport, setpostidtoreport] = useState()
    const [pagemod, setpagemod] = useState();


    useKeyboardShortcut(
        ["U"],
        shortcutKeys => navigate(`/subgreddit/submembers${location.search}`),
        { 
          overrideSystem: false,
          ignoreInputFields: false, 
          repeatOnHold: false 
        }
      );
       useKeyboardShortcut(
        ["J"],
        shortcutKeys => navigate(`/subgreddit/subrequests${location.search}`),
        { 
          overrideSystem: false,
          ignoreInputFields: false, 
          repeatOnHold: false 
        }
      );
      useKeyboardShortcut(
        ["S"],
        shortcutKeys => navigate(`/subgreddit/stats${location.search}`),
        { 
          overrideSystem: false,
          ignoreInputFields: false, 
          repeatOnHold: false 
        }
      );
      useKeyboardShortcut(
        ["R"],
        shortcutKeys => navigate(`/subgreddit/reports${location.search}`),
        { 
          overrideSystem: false,
          ignoreInputFields: false, 
          repeatOnHold: false 
        }
      );


    useEffect(() => {
        const fetchdata = async () => {
            let res = await fetch('http://localhost:3001/api/fetchposts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:
                    JSON.stringify({ pageid: pageid })// body data type must match "Content-Type" header
            })
            let resp = await res.json()
            if (resp.error) {
                console.log(resp.error)
            }
            else {
                let data = jwt(resp.token);


                let posts = data.posts;
                let commentbox = [];
                for (let i = 0; i < posts.length; i++) {
                    commentbox.push("");
                }

                setcommentbox(commentbox);
                setposts(data.posts);
                setSubname(data.Name);
                setSubdesc(data.Description);
                setpagemod(data.moderator);
            }
        }
        fetchdata();

    }, [pagereload])

    const addcomment = async (postid, index) => {


        let comment = commentbox[index];

        let res = await fetch('http://localhost:3001/api/commentpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ username: user_username, postid: postid, comment: comment })// body data type must match "Content-Type" header
        })


        let resp = await res.json();
        if (resp.error) {
            toast.error(resp.error);
        }
        else {
            toast.success(resp.message);
        }


        setpagereload(!pagereload);

        let temp = commentbox;
        temp[index] = "";
        setcommentbox(temp);
    }

    const handlecommentbox = (e) => {
        let temp = commentbox;
        temp[e.target.id] = e.target.value;
        setcommentbox(temp);
    }

    const followmod = async (postmoderator) => {
        let res = await fetch('http://localhost:3001/api/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ user: user_username, whotofollow: postmoderator })// body data type must match "Content-Type" header
        })
        let resp = await res.json();
        if (resp.error) {
            toast.error(resp.error);
        }
        else {
            localStorage.setItem("token", resp.token);
            toast.success("Followed Mod Successfully");
        }
    }

    const report = async () => {
    
        let res = await fetch('http://localhost:3001/api/reportpage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({
                    reportedby: user_username, // username of the person who reported
                    whomreported: pageid, // pageid of the subgreddit page reported
                    concern: concern ,
                    postid: postidtoreport,
                })// body data type must match "Content-Type" header
        })
        let resp = await res.json();
        if (resp.error) {
            toast.error(resp.error);
        }
        else {
            toast.success("Reported Successfully");
        }
        setshowModal(false);
    }

    // const togglecommentbox = (index) => {
    //     console.log(index)
    //     let temp = commentbox;
    //     temp[index] = !temp[index];
    //     setcommentbox(temp);
    // }

    const upvote = async (postid) => {
        let res = await fetch('http://localhost:3001/api/upvotepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ postid: postid })// body data type must match "Content-Type" header
        })
        let resp = await res.json()
        if (resp.error) {
            toast.error(resp.error);
        }
        else {
            toast.success(resp.message);
        }
    }

    const downvote = async (postid) => {
        let res = await fetch('http://localhost:3001/api/downvotepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ postid: postid })// body data type must match "Content-Type" header
        })
        let resp = await res.json()
        if (resp.error) {
            toast.error(resp.error);
        }
        else {
            toast.success(resp.message);
        }
    }

    const savepost = async (postid) => {
        let res = await fetch('http://localhost:3001/api/savepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ postid: postid, username: user_username })// body data type must match "Content-Type" header
        })
        let resp = await res.json()
        if (resp.error) {
            toast.error(resp.error);
        }
        else {
            toast.success(resp.message);
        }
    }

    const handleconcern = (e) => {
        setconcern(e.target.value);
    }

    return (
        <>

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
                <img src='./randompic.jpeg'></img>
                {/* Modal Box */}
                {showModal ? (
                    <>
                        <div
                            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        >
                            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                {/*content*/}
                                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                    {/*header*/}
                                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                        <h3 className="text-3xl font-semibold">
                                            Why Do You Want To Report This Post?
                                        </h3>

                                    </div>
                                    {/*body*/}
                                    <div className="relative p-6 flex-auto">
                                        
                                        <label for="concern" className="leading-7 text-lg text-gray-600">Write your Concern</label>
                                        <input className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2' type='text' placeholder='Concern' onChange={handleconcern} />
                                    </div>
                                    {/*footer*/}
                                    <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                        <button
                                            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={() => setshowModal(false)}
                                        >
                                            Close
                                        </button>
                                        <button
                                            className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                            type="button"
                                            onClick={report}
                                        >
                                            Report Page
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                ) : null}

                {/* After Modal Box */}
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{Subname}</h1>
                        
                        <p className='leading-relaxed text-base'>{Subdesc}</p>
                    </div>
                    <div className="flex flex-wrap -m-4">

                        {posts.map((post, index) => {
                            console.log(post)
                            return (
                                <div key={post._doc.PostId} className="xl:w-1/3 md:w-1/2 p-4">
                                    <div className="border border-gray-200 p-6 rounded-lg">
                                        <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                                            <CiSaveUp1 className='text-2xl cursor-pointer' onClick={() => { savepost(post._doc.PostId) }} />
                                        </div>
                                        <h2 className="text-lg text-gray-900 font-medium title-font mb-2">{post._doc.Title}</h2>
                                        <h3 className='ttext-lg text-gray-900 font-medium title-font mb-2'>Posted By: {post.userblocked && user_username!=pagemod ? "Blocked User" : post._doc.Postedby}</h3>
                                        <p className="leading-relaxed text-base mb-4">{post._doc.Text}</p>

                                        <div className="text-center mt-2 leading-none flex justify-center bottom-0 left-0 w-full py-4">
                                            <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">

                                                <svg className='w-4 h-4 mr-1' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox='0 0 512 512'><path d="M456,192,300,180l23-89.4C329,64,322.22,48.73,300.53,42l-34.69-9.85a4,4,0,0,0-4.4,1.72l-129,202.34a8,8,0,0,1-6.81,3.81H16V448H133.61a48,48,0,0,1,15.18,2.46l76.3,25.43a80,80,0,0,0,25.3,4.11H428.32c19,0,31.5-13.52,35.23-32.16L496,305.58V232C496,209.94,478,194,456,192Z" fill="blue"></path>
                                                </svg>{post._doc.Upvotes}
                                            </span>
                                            <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                                                <svg className='w-4 h-4 mr-1 m-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.856 0-.29-.036-.586-.113-.857a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z" fill="red"></path> </svg>
                                                {post._doc.Downvotes}
                                            </span>
                                        </div>

                                        {/* COMMENT SECTION */}
                                        <div className="antialiased mx-auto max-w-screen-sm mb-5">

                                            <div className='flex flex-col mt-3 sm:flex-row sm:items-center sm:justify-between'>
                                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Comments</h3>
                                                <button>
                                                    <IoIosArrowDropdown id={index} className='text-2xl' /></button>

                                            </div>


                                            <div >
                                                {post.comments.length > 0 && post.comments.map((comment, index) => {
                                                    return (
                                                        <div key={index} className="flex m-2">
                                                            <div className="flex-1 border border-blue-600 rounded-lg px-4 py-2 sm:px-6 sm:py-4 leading-relaxed">
                                                                <strong>{comment.Commentedby}</strong>
                                                                <p className="text-sm">
                                                                    {comment.Comment}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}

                                            </div>


                                            <div className="mb-6">

                                                <input id={index} onChange={handlecommentbox} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2" placeholder='Add New Comment' />

                                                <button onClick={() => { addcomment(post._doc.PostId, index) }} type="button" className="text-white bg-blue-400 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Post Comment</button>
                                            </div>

                                        </div>


                                        <button onClick={() => { followmod(post._doc.Postedby) }} type="button" className="text-white bg-green-500 hover:bg-blue-800 focus:ring-4 w-2/3 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Follow</button>


                                        <button onClick={() => { setpostidtoreport(post._doc.PostId);setshowModal(true); }} type="button" className="text-white bg-red-500 hover:bg-blue-800 focus:ring-4 w-2/3 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Report Page</button>


                                        <div className='flex justify-between'>
                                            <button onClick={() => upvote(post._doc.PostId)} ><IoMdThumbsUp className='text-4xl' /></button>
                                            <button onClick={() => downvote(post._doc.PostId)} ><IoMdThumbsDown className='text-4xl' /></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}



                    </div>
                    <button onClick={() => { navigate(`/subgreddit/createpost?${pageid}`) }} className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Create More</button>
                </div>
            </section>
        </>
    )
}

export default WithAuth(Subgredit);