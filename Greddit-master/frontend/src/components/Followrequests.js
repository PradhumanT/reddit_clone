import React from 'react'
import jwt from 'jwt-decode' // import dependency
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import WithAuth from './WithAuth';

const Followrequests = () => {

  const [requests, setrequests] = useState([]);
  const [pagemod, setpagemod] = useState()
  const location = useLocation();

  let usertoken = localStorage.getItem('token');
  let user_username = jwt(usertoken).username;

  useEffect(() => {
    const pageid = location.search.slice(1);
    const fetchdata = async () => {

      let res = await fetch('http://localhost:3001/api/fetchjoiningreq', {
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
        setrequests(data.requests)
        setpagemod(data.pagemod)
      }
    }
    fetchdata()
  }, [])

  const acceptrequest = async (pusername) => {
    const pageid = location.search.slice(1);
    let res = await fetch('http://localhost:3001/api/acceptjoiningreq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        JSON.stringify({ pageid: pageid, username: pusername })// body data type must match "Content-Type" header
    })
    let resp = await res.json()
    if (resp.error) {
      console.log(resp.error)
    }
    else {
      let data = jwt(resp.token).requests;
      setrequests(data)
    }
  }

  const rejectrequest = async (pusername) => {
    const pageid = location.search.slice(1);
    let res = await fetch('http://localhost:3001/api/rejectjoiningreq', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        JSON.stringify({ pageid: pageid, username: pusername })// body data type must match "Content-Type" header
    })
    let resp = await res.json()
    if (resp.error) {
      console.log(resp.error)
    }
    else {
      let data = jwt(resp.token).requests;
      setrequests(data)
    }
  }


  if(user_username != pagemod)
  {
    return (<>
    <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">You are not authorised to view this page</h1>
          <p className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Only a moderator can view join requests of his/her page</p>
        </div>
        </>)
  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full mb-20">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Join Requests</h1>
        </div>

        <div className="flex flex-wrap -m-2">

          {requests.map((request) => {
            return (
              <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                  <Link to={`/otherprofile?username=${request.pusername}`} className="flex-grow">
                    <h2 className="text-gray-900 title-font font-medium">{request.pfirstname} {request.plastname}</h2>
                    <p className="text-gray-500">{request.pusername}</p>
                  </Link>
                  <button onClick={() => acceptrequest(request.pusername)} className='text-green-500 hover:bg-gray-200  m-2 font-bold py-2 px-4 border border-b-slate-200 rounded-full'>Accept</button>
                  <button onClick={() => rejectrequest(request.pusername)} className='text-red-500 hover:bg-gray-200  font-bold py-2 px-4 border border-b-slate-200 rounded-full'>Reject</button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default WithAuth(Followrequests);