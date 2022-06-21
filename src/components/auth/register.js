import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";

export default function Register() {
  const history = useHistory()
  const {register , handleSubmit} = useForm(); 
  const [username, setusername ] = useState(''); 
  const [isfinal , setisfinal] = useState(false); 
  const [isdone, setisdone ] = useState(false); 
  const signup = (data) => {
    axios.post( 'http://localhost:3001/signup' ,data
    ).then(res => {
        if (res.statusText === 'OK') {
             setisdone((pre)=> true )
        }
      })
      .catch(error => {
           throw error  
      });
  }

  useEffect(()=>{
         if(username !== '')
         axios.post('http://localhost:3001/verifyusername', {username : username} ).then((res)=>{
                   if(res.data.status === 'success'){
                       setisfinal((pre)=>true); 
                   }else {
                       setisfinal((pre)=> false)
                   }
         })
  },[username])

  return (
      <div >
         { !isdone ? 
        <div>
          <h2>Please Sign up</h2>
          <form onSubmit={handleSubmit(signup)}>
          <div style={{padding : '10px' , background : isfinal ? 'green' : 'white' }}>
           <input type="text"  {...register('username')} placeholder="username" onChange={(e)=> setusername(e.target.value)}  required/> 
          </div>
          <input type="text"  {...register('name')} placeholder="full name" />
          <input type="text"  {...register('country')} placeholder="country" />
          <input type="email" {...register('email')} placeholder="email"  required/>
          <input type="password" {...register('password')} placeholder="password" required/>
          <button type="submit">Sign Up</button>
          </form>
        </div> : <div>
                <h2>Completed SignUp</h2>
                <button onClick={()=>{history.push('/')}}>Login</button>
            </div>
} 
      <Link to={'/'}>Already Registerd ? login here </Link>
      </div>
      
  );
}
