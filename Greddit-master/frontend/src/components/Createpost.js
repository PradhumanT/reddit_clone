import React from 'react'
import { useState } from 'react'
import jwt from 'jwt-decode' // import dependency
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';
import WithAuth from './WithAuth';

const Createpost = () => {

    const [formdata, setformdata] = useState({})
    

    let location = useLocation();

    const updateData = e => {
        setformdata({
          ...formdata,
          [e.target.name]: e.target.value
        })
      }

    const handlesubmit =async () =>{
        let token = localStorage.getItem("token");
        let userdata = jwt(token);

        let res = await fetch('http://localhost:3001/api/createpost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify({
            pageid:location.search.slice(1),
            postedby:userdata.username,
            title:formdata.title,
            text:formdata.posttext,
          })// body data type must match "Content-Type" header
      })
      let resp = await res.json()
      if (resp.error) {
        toast.error(resp.error)
      }
      else {
        toast.success("Created Post Successfully")
        if(resp.containsbanned === true)
          toast.error("Post contains banned words");
      }
    }
    

    return (
        <div className="my-5 container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
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
            <h1 className='mb-8 text-3xl text-center'>Fill out the form to create new Post</h1>
            <div class="w-full ">
                <form class="bg-white shadow-md rounded w-full px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            Title
                        </label>
                        <input onChange={updateData} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" name="title" type="text" placeholder=" Title of Post" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            Text
                        </label>
                        <textarea onChange={updateData} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="posttext" name="posttext" type="text" rows={5} placeholder="Text of Post" />
                    </div>
                    
                    
                    <div class="flex items-center justify-between">
                        <button onClick={handlesubmit} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                            Submit
                        </button>
                        
                    </div>
                </form>
                
            </div>
        </div>
    )
}

export default WithAuth(Createpost);