import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { BrowserRouter as Router, Routes, Switch, Route, Link, useLocation } from 'react-router-dom';
import Profile from './components/Profile';
import Signup from './components/Signup';
import Login from './components/Login';
import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Followers from './components/Followers';
import Following from './components/Following';
import Otherprofile from './components/Otherprofile';
import Mysubgreddits from './components/Mysubgreddits';
import Createsubgredit from './components/Createsubgredit';
import Subgredit from './components/Subgredit';
import Createpost from './components/Createpost';
import WithAuth from './components/WithAuth';
import Home from './components/Home'
import Submembers from './components/Submembers';
import Followrequests from './components/Followrequests';
import SavedPosts from './components/SavedPosts';
import Subgredditstats from './components/Subgredditstats';
import Reports from './components/Reports';


function App() {

  const [user, setuser] = useState({})

  return (

    <Router>
      <div className='App flex flex-col min-h-screen'>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home></Home>} ></Route>
          <Route exact path="/profile" element={<Profile></Profile>} ></Route>
          <Route path='/auth' element={<Auth ></Auth>} ></Route>
          <Route path='/otherprofile' element={<Otherprofile ></Otherprofile>} ></Route>
          <Route exact path='/followers' element={<Followers />} ></Route>
          <Route exact path='/following' element={<Following ></Following>} ></Route>
          <Route exact path='/mysubgreddits' element={<Mysubgreddits></Mysubgreddits>} ></Route>
          <Route path='/subgreddit' element={<Subgredit ></Subgredit>} ></Route>
          <Route exact path='/createsubgreddit' element={<Createsubgredit ></Createsubgredit>} ></Route>
          <Route path='/subgreddit/createpost' element={<Createpost ></Createpost>} ></Route>
          <Route path='/subgreddit/submembers' element={<Submembers></Submembers>} ></Route>
          <Route path='/subgreddit/subrequests' element={<Followrequests></Followrequests>} ></Route>
          <Route exact path='/savedposts' element={<SavedPosts />} ></Route>
          <Route path='/subgreddit/stats' element={<Subgredditstats />} ></Route>
          <Route path='/subgreddit/reports' element={<Reports />} ></Route>
        </Routes>
        <Footer />
      </div>
    </Router>


  );
}

export default App;
