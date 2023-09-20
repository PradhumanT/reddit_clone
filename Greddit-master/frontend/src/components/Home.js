import React from 'react';
import { useState, useEffect } from 'react';
import jwt from 'jwt-decode' // import dependency
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WithAuth from './WithAuth';

const Home = () => {

  const sortalpha = (a, b) => {
    if (a.Name < b.Name) {
      return -1;
    }
    if (a.Name > b.Name) {
      return 1;
    }
    return 0;
  }

  const sortfollowers = (a, b) => {
    if (a.numfollowers < b.numfollowers) {
      return -1;
    }
    if (a.numfollowers > b.numfollowers) {
      return 1;
    }
    return 0;
  }

  const sortdate = (a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  }

  let user = jwt(localStorage.getItem('token'));
  let user_username = user.username;

  const [searched, setsearched] = useState();
  const [subgreddits, setsubgreddits] = useState([])
  const [todisplaysubgreddit, settodisplaysubgreddit] = useState([]);
  const [sortorder, setsortorder] = useState("alpha");

  const [isList, setIsList] = useState(false);
  const [tags, settags] = useState([])

  const handlechecks = (e) => {
    if (e.target.checked) {
      settags([...tags, e.target.value])
    }
    else {
      settags(tags.filter(tag => tag !== e.target.value))
    }
  }


  useEffect(() => {
    const fetchdata = async () => {
      let res = await fetch('http://localhost:3001/api/getallsubgreddits');
      let resp = await res.json();
      if (resp.error) {
        console.log(resp.error);
      }
      else {
        // sorted alphabetically By default
        setsubgreddits(jwt(resp.token).subgreddits.sort(sortalpha));
      }
    }
    fetchdata();
  }, [subgreddits]) // whenever subgreddits change

  const followreq = async (pageid) => {
    let res = await fetch('http://localhost:3001/api/joinsubgreddit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user_username,
        pageid: pageid
      })
    });
    let resp = await res.json();
    if (resp.error) {
      toast.error(resp.error);
    }
    else {
      toast.success(resp.message);
    }
  }

  const leavepage = async (pageid) => {
    let res = await fetch('http://localhost:3001/api/leavepage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: user_username,
        pageid: pageid
      })
    });
    let resp = await res.json();
    if (resp.error) {
      toast.error(resp.error);
    }
    else {
      toast.success(resp.message);
    }
  }

  const handlesortval = (e) => {
    setsortorder(e.target.value);
  }

  const handlesort = (sub) => {

    if (sortorder === "alpha") {
      return subgreddits.sort(sortalpha);
    }
    else if (sortorder === "followers") {
      return subgreddits.sort(sortfollowers);
    }
    else if (sortorder === "date") {
      return subgreddits.sort(sortdate)
    }
    else
      return sub;
  }

  const handletags = (e) => {

    let sub = subgreddits.filter(subgreddit => {
      let flag = false;
      tags.map(tag => {
        if (subgreddit.Tags && subgreddit.Tags.toLowerCase().includes(tag.toLowerCase())) {
          flag = true;
          console.log("found")
        }
      })
      return flag;
    });

    setsubgreddits(sub);
  }

  const options = {
    includeScore: true,
    keys: [
      {
        name: 'Name',
        weight: 0.7
      },
      {
        name: 'Tags',
        weight: 0.3
      }
    ]
  }

  const fuse = new Fuse(subgreddits, options);

  const searchchange = (e) => {
    setsearched(e.target.value);
    const result = fuse.search(searched);

    settodisplaysubgreddit(result);
    // console.log(todisplaysubgreddit);
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

      {/* SEARCH BAR */}
      <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input onChange={searchchange} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Subgreddts ..." value={searched} required />
        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
      </div>

      {/* DROPDOWN MENU */}
      <div className="m-4">
        <div onClick={() => setIsList(!isList)} className="w-64 p-4 shadow rounded bg-white text-sm font-medium leading-none text-gray-800 flex items-center justify-between cursor-pointer">
          Filtering Tags
          <div>
            {isList ? (
              <div>
                <svg width={10} height={6} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.00016 0.666664L9.66683 5.33333L0.333496 5.33333L5.00016 0.666664Z" fill="#1F2937" />
                </svg>
              </div>
            ) : (
              <div>
                <svg width={10} height={6} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.00016 5.33333L0.333496 0.666664H9.66683L5.00016 5.33333Z" fill="#1F2937" />
                </svg>
              </div>
            )}
          </div>
        </div>
        {isList && (
          <div className="w-64 mt-2 p-4 bg-white shadow rounded">

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="pl-4 flex items-center">
                  <div className="bg-gray-100 dark:bg-gray-800 border rounded-sm border-gray-200 dark:border-gray-700 w-3 h-3 flex flex-shrink-0 justify-center items-center relative">
                    <input type="checkbox" className="checkbox opacity-0 absolute cursor-pointer w-full h-full" value="Sports" onChange={handlechecks} />
                    <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                      <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M5 12l5 5l10 -10" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm leading-normal ml-2 text-gray-800">Sports</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="pl-4 flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-800 border rounded-sm border-gray-200 dark:border-gray-700 w-3 h-3 flex flex-shrink-0 justify-center items-center relative">
                      <input type="checkbox" className="checkbox opacity-0 absolute cursor-pointer w-full h-full" value="Fan Club" onChange={handlechecks} />
                      <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                        <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm leading-normal ml-2 text-gray-800">Fan Club</p>
                  </div>
                </div>

              </div>

            </div>
            <div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="pl-4 flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-800 border rounded-sm border-gray-200 dark:border-gray-700 w-3 h-3 flex flex-shrink-0 justify-center items-center relative">
                      <input type="checkbox" className="checkbox opacity-0 absolute cursor-pointer w-full h-full" value="Love" onChange={handlechecks} />
                      <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                        <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm leading-normal ml-2 text-gray-800">Love</p>
                  </div>
                </div>
              </div>

            </div>

            <div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="#4B5563" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="pl-4 flex items-center">
                    <div className="bg-gray-100 dark:bg-gray-800 border rounded-sm border-gray-200 dark:border-gray-700 w-3 h-3 flex flex-shrink-0 justify-center items-center relative">
                      <input type="checkbox" className="checkbox opacity-0 absolute cursor-pointer w-full h-full" value="Cricket" onChange={handlechecks} />
                      <div className="check-icon hidden bg-indigo-700 text-white rounded-sm">
                        <svg className="icon icon-tabler icon-tabler-check" xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" />
                          <path d="M5 12l5 5l10 -10" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-sm leading-normal ml-2 text-gray-800">Cricket</p>
                  </div>
                </div>

              </div>

            </div>
            <button onClick={handletags} className="text-xs bg-indigo-100 hover:bg-indigo-200 rounded-md mt-6 font-medium py-2 w-full leading-3 text-indigo-700">Select</button>
          </div>
        )}
        <style>
          {` .checkbox:checked + .check-icon {
                display: flex;
            }`}
        </style>
      </div>



      {/* DISPLAYED SUBGREDDITS */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          {/* SORTING TAGS */}

          <select id="countries" onChange={handlesortval} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-10 w-4/12">
            <option value="alpha" selected>Alphabetically </option>
            <option value="followers">Number Followers </option>
            <option value="date">Creation Date</option>
          </select>

          {/* JOINED SUBGREDDITS */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Joined Subgreddits</h2>
          <div className="flex flex-wrap -m-4 mb-6">

            {/* WITH SEARCH BAR */}
            {searched && todisplaysubgreddit.map((subgreddit) => {
              if (subgreddit.item.Followers.filter(e => e.musername === user_username).length > 0) {
                return (
                  <div key={subgreddit.PageId} className="p-4 lg:w-1/3">
                    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                      <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{subgreddit.item.Tags}</h2>
                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">{subgreddit.item.Name}</h1>
                      <p className="leading-relaxed mb-3">{subgreddit.item.Description}</p>
                      <h3>Banned Keywords</h3>
                      <p className="leading-relaxed mb-3 text-red-600">{subgreddit.item.Banned_keywords}</p>
                      <Link to={`/subgreddit?${subgreddit.item.PageId}`} className="text-indigo-500 inline-flex items-center">Learn More
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </Link>

                      {(subgreddit.item.Moderator != user_username) && <button onClick={() => leavepage(subgreddit.item.PageId)} className="flex mx-auto mt-16 text-white bg-red-500 border-0 py-2 px-8 w-1/3 focus:outline-none hover:bg-red-600 rounded text-lg">Leave</button>}

                      <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          <svg className="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>{subgreddit.item.numfollowers} followers
                        </span>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                          <svg className="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                          </svg>{subgreddit.item.numposts} posts
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
            })}

            {/* WITHOUT SEARCH BAR */}
            {!searched && handlesort(subgreddits).map((subgreddit) => {
              if (subgreddit.Followers.filter(e => e.musername === user_username).length > 0) {
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

                      {(subgreddit.Moderator != user_username) && <button onClick={() => leavepage(subgreddit.PageId)} className="flex mx-auto mt-16 text-white bg-red-500 border-0 py-2 px-8 w-1/3 focus:outline-none hover:bg-red-600 rounded text-lg">Leave</button>}

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
              }
            })}
          </div>

          {/* NOT JOINED SUBGREDDITS */}
          <h2 className='text-2xl font-bold text-gray-900 mb-6'>Subgreddits you dont Follow</h2>
          <div className="flex flex-wrap -m-4">
            {/* WITH SEARCH BAR */}
            {searched && todisplaysubgreddit.map((subgreddit) => {
              if (subgreddit.item.Followers.filter(e => e.musername === user_username).length == 0) {
                return (
                  <div key={subgreddit.PageId} className="p-4 lg:w-1/3">
                    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                      <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">{subgreddit.item.Tags}</h2>
                      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">{subgreddit.item.Name}</h1>
                      <p className="leading-relaxed mb-3">{subgreddit.item.Description}</p>
                      <h3>Banned Keywords</h3>
                      <p className="leading-relaxed mb-3 text-red-600">{subgreddit.item.Banned_keywords}</p>
                      <Link to={`/subgreddit?${subgreddit.item.PageId}`} className="text-indigo-500 inline-flex items-center">Learn More
                        <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="M12 5l7 7-7 7"></path>
                        </svg>
                      </Link>

                      <button onClick={() => followreq(subgreddit.item.PageId)} className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 w-1/3 focus:outline-none hover:bg-indigo-600 rounded text-lg">Follow</button>

                      <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <span className="text-gray-400 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-200">
                          <svg className="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>{subgreddit.item.numfollowers} followers
                        </span>
                        <span className="text-gray-400 inline-flex items-center leading-none text-sm">
                          <svg className="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                          </svg>{subgreddit.item.numposts} posts
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
            })}

            {/* WITHOUT SEARCH BAR */}
            {!searched && handlesort(subgreddits).map((subgreddit) => {
              if (subgreddit.Followers.filter(e => e.musername === user_username).length == 0) {
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

                      <button onClick={() => followreq(subgreddit.PageId)} className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 w-1/3 focus:outline-none hover:bg-indigo-600 rounded text-lg">Follow</button>

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
              }
            })}
          </div>

        </div>
      </section>
    </div>
  );
}

export default WithAuth(Home);