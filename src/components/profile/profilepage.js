import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import headers from '../config';
import "./profilepage.css"
import { sendFollowRequest, sentInterviewRequest, sendconnectionRequest } from '../home/Home';
import { acceptConnection } from '../home/Home';

export default function ProfilePage() {
    const { id } = useParams(); 
    const [data, setData ] = useState(); 
    const [role , setrole] = useState(false); 
    
    const header = headers(); 
    useEffect(()=>{
        if(header !== undefined && id === undefined ){
            axios.get('http://localhost:3001/user/profile', header).then(res=>{
                if(res.statusText === 'OK')
                 setData(res.data); 
            })
        } else {
            if(header !== undefined) {
            axios.post('http://localhost:3001/user/findSingleProfileWithFilter', {username : id },  header).then(res=>{
                console.log(res)
                if(res.statusText === 'OK')
                 console.log(res)
                 setData(res.data); 
                 if(res.data && res.data.user) {
                     setrole(res.data.user.ishost); 
                 }
            })
        }
    } 
    },[])

 

    const toggleRole = ()=>{
          setrole((pre)=> !pre); 
          if(header !== undefined) {
              axios.put('http://localhost:3001/user/profile', {ishost : true} , header).then((res)=>{
                    if(res.statusText !== 'OK'){
                         setrole((pre)=> !pre); 
                    }
                    console.log(res)
              })
          }
    }

    return (
        <div className='profile-page'>
         { data && data.user && 
            <div className="content-profile-page">
                <div className="profile-user-page profile-">
                    <div className="img-user-profile">
                        <img className="avatar" src="http://gravatar.com/avatar/288ce55a011c709f4e17aef7e3c86c64?s=200" alt="jofpin" />
                    </div>
                   
                    <div className="user-profile-data">
                        <h1>{data.user.username}</h1>
                        <h3>{data.user.email}</h3>
                        <p>{data.github}</p>
                        <p>{data.user.country}</p>
                    <button onClick={()=> sendFollowRequest(data.user.username)}> Follow </button>
                    <button onClick={()=> sentInterviewRequest(data.user.username)}> Interview Request </button>
                    <button onClick={()=> sendconnectionRequest(data.user.username)}> Connect </button>
                    <button onClick={()=> acceptConnection(data.user._id)}> Accept Connection</button>
                    </div> 
                   <span> Role :  { role ?  <h3>Interviewer</h3> : <h3>Candidate</h3>} </span>
                    <button onClick={toggleRole}>Change role ? </button>
                    <div className="description-profile">{data.description}<a href="https://twitter.com/codernishchay" title="bullgit"><strong>@bullgit</strong></a> | I love to create small things for the internet!</div>
                  
                </div>
            </div>

}
        </div>
    )
}
