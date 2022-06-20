import React, { useRef } from "react";
import { useAuth } from "./authContext";
import axios from "axios";

export default function Register() {
  const email = useRef();
  const password = useRef();

  const handleSubmit = (e) => {
    if(email.current.value == null || password.current.value == null) {
       alert("null username , password")
       return ; 
    }
    e.preventDefault()
    const em  = email.current.value ; 
    const pas = password.current.value ; 
    axios.post( 'http://localhost:3001/signup' ,
      {
        email : em,
        password: pas
      }
    )
      .then(res => {
        console.log(res)
        if (res.statusText === 'OK') {
          return res ; 
        }
        throw res;
      })
      .catch(error => {
           throw error  
      });

  }
  return (
    <>
      <div >
        <div></div>
        <div ></div>
        <div>
          <h2>Please Sign up</h2>
          <input type="email" ref={email} placeholder="email" />
          <input type="password" ref={password} placeholder="password" />
          <button  onClick={handleSubmit}>Sign Up</button>
        </div>
      </div>
    </>
  );
}
