import React from 'react'
import { useState } from 'react'
import jwt from 'jwt-decode' // import dependency
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithAuth from './WithAuth';


const Createsubgredit = () => {

    const [formdata, setformdata] = useState({})

    const updateData = e => {
        setformdata({
          ...formdata,
          [e.target.name]: e.target.value
        })
      }

    const handlesubmit =async () =>{
        let token = localStorage.getItem("token");
        let userdata = jwt(token);

        let res = await fetch('http://localhost:3001/api/createsubgreddit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify({
            moderator:userdata.username,
            banned_keywords:formdata.banned_keywords,
            tags:formdata.tags,
            name:formdata.name,
            description:formdata.description,
            modfname:userdata.firstname,
            modlname:userdata.lastname
          })// body data type must match "Content-Type" header
      })
      let resp = await res.json()
      if (resp.error) {
        toast.error(resp.error)
      }
      else {
        toast.success("Created Page Successfully")
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
            <h1 className='mb-8 text-3xl text-center'>Fill out the form to create new subgreddit page</h1>
            <div class="w-full ">
                <form class="bg-white shadow-md rounded w-full px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            Name of Subgreddit
                        </label>
                        <input onChange={updateData} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" name="name" type="text" placeholder=" Name of Subgreddit" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            Description
                        </label>
                        <textarea onChange={updateData} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" name="description" type="text" rows={5} placeholder="Description of subgreddit" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            Banned Keywords
                        </label>
                        <input onChange={updateData} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="banned_keywords" name="banned_keywords" type="text" placeholder="Write Comma Seperated Banned Keywords" />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                            Tags
                        </label>
                        <input onChange={updateData} class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="banned_keywords" name="tags" type="text" placeholder="Write Comma Seperated Tags" />
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

export default WithAuth(Createsubgredit);