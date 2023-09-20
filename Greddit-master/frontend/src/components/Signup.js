import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {


  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [username, setusername] = useState("");
  const [age, setage] = useState(0);
  const [contactno, setcontactno] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [submitdisabled, setsubmitdisabled] = useState(true);
  const [formdata, setformdata] = useState({})

  const inputvalidation = (formdata) =>{
    if (formdata.firstname === "" || formdata.lastname === "" || formdata.username === "" || formdata.age === "" || formdata.contactno === "" || formdata.email === "" || formdata.password === "" || formdata.confirm_password === "") {
      setsubmitdisabled(true)
      return;
    }

    var emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formdata.email.match(emailregex)) {  
      setsubmitdisabled(true)
      return;
    }
    var phoneno = /^[6789]\d{9}$/;
    if (!formdata.contactno.match(phoneno)) {
      setsubmitdisabled(true)
      return;
    }

    setsubmitdisabled(false);
  }

  const change = (e) => {
    let newformdata = {...formdata , [e.target.name]:e.target.value};
    
    if (e.target.name === "firstname")
      setfirstname(e.target.value);
    if (e.target.name === "lastname")
      setlastname(e.target.value);
    if (e.target.name === "username")
      setusername(e.target.value);
    if (e.target.name === "age")
      setage(e.target.value);
    if (e.target.name === "contactno")
      setcontactno(e.target.value);
    if (e.target.name === "email")
      setemail(e.target.value);
    if (e.target.name === "password")
      setpassword(e.target.value);
    if (e.target.name === "confirm_password")
      setconfirmpassword(e.target.value);
    inputvalidation(newformdata);
    setformdata(newformdata);
  }

  const reset = () => {
    setfirstname("")
    setlastname("")
    setusername("")
    setemail("")
    setpassword("")
    setage()
    setcontactno("")
    setconfirmpassword("");
    setformdata({});
  }

  const submit = async () => {


    if (password === confirmpassword) {


      const datatosend = { firstname, lastname, username, age, contactno, email, password };

      if (firstname === "" || lastname === "" || username === "" || age === "" || contactno === "" || email === "" || password === "" || confirmpassword === "") {
        toast.error("Please fill all the fields")
        return;
      }

      var emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!email.match(emailregex)) {
        toast.error("Please enter a valid email address");
        return;
      }

      var phoneno = /^[6789]\d{9}$/;
      if (!contactno.match(phoneno)) {
        toast.error("Please enter a valid phone number");
        return;
      }
      

      fetch('http://localhost:3001/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          JSON.stringify(datatosend)// body data type must match "Content-Type" header
      }).then((response) => {
        if (response.error)
          toast.error(response.error)
        else
          toast.success("You are Successfully Signed Up")
        reset()
      })
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
          <h1 className="mb-8 text-3xl text-center">Sign up</h1>
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="firstname"
            placeholder="First Name" onChange={change} />

          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="lastname"
            placeholder="Last Name" onChange={change} />

          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="username"
            placeholder="User Name" onChange={change} />

          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="email"
            placeholder="Email" onChange={change} />

          <input
            type="number"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="age"
            placeholder="Age" onChange={change} />

          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="contactno"
            placeholder="Contact No" onChange={change} />

          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password" onChange={change} />
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm_password"
            placeholder="Confirm Password" onChange={change} />

          <button
            disabled={submitdisabled}
            style={{ backgroundColor: submitdisabled ? "gray" : "" }}
            onClick={submit}
            type="submit"
            className="w-full text-center py-3 rounded bg-green-400 text-black hover:bg-green-dark focus:outline-none my-1"
          >Create Account</button>

          <div className="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to the
            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
              Terms of Service
            </a> and
            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="text-grey-dark mt-6">
          Already have an account?
          <Link className="no-underline border-b border-blue text-blue-500" to={"/auth?mode=login"}>
            Log in
          </Link>.
        </div>
      </div>
    </div>
  )
}

export default Signup