import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

const Navbar = ()=>{
     const {state, dispatch } = useAuth(); 
     const handleLogout = ()=>{
       dispatch({
        type: "LOGOUT"
       })
     }
     return (
        <div className="nav">
        <div className="nav-header">
          <div className="nav-title">
          </div>
        </div>
        <div className="nav-btn">
          
        </div>
        
        <div className="nav-links">
          <a href="//github.com/codernishchay/interview-zone" target="_blank">Github</a>
            {state.isAuthenticated && <Link to='/profile'>Profile</Link>}
           {!state.isAuthenticated && <Link to={'/login'} >Login</Link>}
           { !state.isAuthenticated && <Link to={'/register'} >Signup</Link> } 
           {state.isAuthenticated && <Link to='/chatbox'>Messages</Link>}
           { state.isAuthenticated && <button onClick={handleLogout}>Logout</button> }
        </div>
      </div>
     )
}

export default Navbar ; 