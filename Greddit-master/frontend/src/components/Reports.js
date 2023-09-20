import React from 'react'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import jwt from 'jwt-decode' // import dependency
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithAuth from './WithAuth';

const Reports = () => {

    let location = useLocation();
    let usertoken = localStorage.getItem('token');
    let user_username = jwt(usertoken).username;

    const [reports, setreports] = useState([]);
    const [pageid, setpageid] = useState(location.search.slice(1));
    const [isblocking, setisblocking] = useState([])

    useEffect(() => {
        const fetchReports = async () => {
            let res = await fetch('http://localhost:3001/api/getreports', {
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

                let reports = data.reports;
                setreports(reports);

                let blockbutton = [];
                reports.forEach((report) => {
                    blockbutton.push(false);
                })
                setisblocking(blockbutton);
            }
        }
        fetchReports()
    }, [])

    const ignore = async (reportid) => {
        let res = await fetch('http://localhost:3001/api/ignorereport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ reportid })// body data type must match "Content-Type" header
        })
        let resp = await res.json();
        if (resp.error) {
            toast.error(resp.error)
        }
        else {
            toast.success(resp.message)
        }
    }
    const block = async (reportid) => {
        let res = await fetch('http://localhost:3001/api/blockreport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ reportid })// body data type must match "Content-Type" header
        })
        let resp = await res.json();
        if (resp.error) {
            toast.error(resp.error)
        }
        else {
            toast.success(resp.message)
        }
    }
    const deletepost = async(reportid) => {
        let res = await fetch('http://localhost:3001/api/deletepost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:
                JSON.stringify({ reportid })// body data type must match "Content-Type" header
        })
        let resp = await res.json();
        if (resp.error) {
            toast.error(resp.error)
        }
        else {
            toast.success(resp.message)
        }
    }


    const toggleblock = (e, reportid, index) => {
       let temp = isblocking;
        
       // i.e we can block the user
        if(temp[index] === false){
            // start the blocking interval
            temp[index] = true;
            setisblocking(temp);

            let countdown = 5;
            const timerid  = setInterval(() => {
                let checkblock = isblocking;
                if(checkblock[index]===false) // abort blocking
                {
                    clearInterval(timerid);
                    e.target.innerText = "Block User";
                }
                else
                {
                    countdown--;
                    if (countdown === 0) {
                        clearInterval(timerid);
                        e.target.innerText = "Blocked User";
                        block(reportid);
                      } else {
                        e.target.innerText = `Cancel in ${countdown} secs`;
                      }
                }
                
            }, 1000);
        }
        else
        {
            // abort blocking
            let checkblock = isblocking;
            checkblock[index] = false;
            setisblocking(checkblock);
        }
    }



    return (
        <div>
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

            <section class="text-gray-600 body-font">
                <div class="container px-5 py-24 mx-auto">
                    <div class="flex flex-col text-center w-full mb-20">
                        <h2 class="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">Report Page</h2>
                        <h1 class="sm:text-3xl text-2xl font-medium title-font text-gray-900">Reports on Your Subgreddit</h1>
                    </div>
                    <div class="flex flex-wrap -m-4">

                        {reports.map((report, index) => {
                            return (
                                <div key={report._doc.ReportId} class="p-4 md:w-1/3">
                                    <div class="flex rounded-lg h-full bg-gray-100 p-8 flex-col">
                                        <div class="flex items-center mb-3">
                                            <h2 class="text-gray-900 text-lg title-font font-medium">Report {index + 1}</h2>
                                        </div>
                                        <div class="flex-grow">

                                            <p class="leading-relaxed text-base">Reported By : {report._doc.Status === "blocked" && report.subgredditmoderator != user_username ? "Blocked User" : report._doc.Reportedby}</p>

                                            <p class="leading-relaxed text-base">Whom Have we Reported : {report.subgredditname}</p>

                                            <p class="leading-relaxed text-base">Concern : {report._doc.concern}</p>

                                            <p class="leading-relaxed text-base">Post Text : {report.posttext}</p>

                                            <p class="leading-relaxed text-base">Status : {report._doc.Status ? report._doc.Status : "Not Yet Decided"}</p>

                                            {report.subgredditmoderator === user_username && <div class="inline-flex mt-5">
                                                <button class="text-gray-800 font-bold py-2 px-4 rounded-l bg-red-500 hover:bg-red-600" disabled={report._doc.Status} style={{ backgroundColor: report._doc.Status ? "gray" : "" }} onClick={() => { deletepost(report._doc.ReportId) }}>
                                                {report._doc.Status === "Deleted" ? "Already Deleted Post" : "Delete Post"}
                                                </button>

                                                <button class="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 rounded-r" disabled={report._doc.Status} style={{ backgroundColor: report._doc.Status ? "gray" : "" }} onClick={() => { ignore(report._doc.ReportId) }}>
                                                    {report._doc.Status === "ignored" ? "Already Ignored" : "Ignore"}
                                                </button>

                                                <button class="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 rounded-r" disabled={report._doc.Status} style={{ backgroundColor: report._doc.Status ? "gray" : "" }} onClick={(e) => { toggleblock(e, report._doc.ReportId, index) }}>
                                                {report._doc.Status === "blocked" ? "Already Blocked User" : "Block User"}
                                                </button>

                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}





                    </div>
                </div>
            </section>
        </div>
    )
}

export default WithAuth(Reports);