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
        <div class="nav">
        <div class="nav-header">
          <div class="nav-title">
          </div>
        </div>
        <div class="nav-btn">
          <label for="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>
        
        <div class="nav-links">
          <a href="//github.com/codernishchay/interview-zone" target="_blank">Github</a>
           {!state.isAuthenticated && <Link to={'/login'} >Login</Link>}
           { !state.isAuthenticated && <Link to={'/register'} >Signup</Link> } 
           { state.isAuthenticated && <button onClick={handleLogout}>Logout</button> }
        </div>
      </div>
     )
}

export default Navbar ; 