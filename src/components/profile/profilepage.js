import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { headers } from '../config';
import "./profilepage.css"

export default function ProfilePage() {
    const {username} = useParams(); 
    const [data, setData ] = useState(); 
    useEffect(()=>{
        if(!username ||  username !== '' || username !== null){
                 axios.get('http://localhost:3001/findSingleProfileWithFilter', {username : username}, headers ).then((res)=>{
                       if(res.statusText === 'OK'){
                              setData(res.data);
                       }
                 })
            }else {
            axios.get('http://localhost:3001/user/profile', headers).then(res=>{
                if(res.statusText === 'OK')
                 setData(res.data); 
            })
        }
    },[])
    return (
        <div> { data && data.user && 
            <div className="content-profile-page">
                <div className="profile-user-page profile-card">
                    <div className="img-user-profile">
                        <img className="profile-bgHome" src="https://37.media.tumblr.com/88cbce9265c55a70a753beb0d6ecc2cd/tumblr_n8gxzn78qH1st5lhmo1_1280.jpg" />
                        <img className="avatar" src="http://gravatar.com/avatar/288ce55a011c709f4e17aef7e3c86c64?s=200" alt="jofpin" />
                    </div>
                    {<button>Follow</button>}
                    <div className="user-profile-data">
                        <h1>{data.user.username}</h1>
                        <h3>{data.user.email}</h3>
                        <p>{data.github}</p>
                        <p>{data.user.country}</p>
                    </div>
                    <div className="description-profile">{data.description}<a href="https://twitter.com/codernishchay" title="bullgit"><strong>@bullgit</strong></a> | I love to create small things for the internet!</div>
                    <h2>Interviews </h2>
                    <ul className="data-user">
                        {data.user.interviews && data.user.interviews.map((interview, index)=>{
                                return <li>{interview}</li>
                        })}
                    </ul>
                    <h2>Connections </h2>
                    <ul className="data-user">
                        {data.user.connections && data.user.connections.map((interview, index)=>{
                                return <li>{interview}</li>
                        })}
                    </ul>
                    <h2> Follow Requests  </h2>
                    <ul className="data-user">
                        {data.user.pendingFollowers && data.user.pendingFollowers.map((interview, index)=>{
                                return <li>{interview}</li>
                        })}
                    </ul>
                    <h2>Followers </h2>
                    <ul className="data-user">
                        {data.user.followers && data.user.followers.map((interview, index)=>{
                                return <li>{interview}</li>
                        })}
                    </ul>
                    <h2> Connection Requests </h2>
                    <ul className="data-user">
                        {data.user.pendingConnections && data.user.pendingConnections.map((interview, index)=>{
                                return <li>{interview}</li>
                        })}
                    </ul>
                    

                </div>
            </div>

}
        </div>
    )
}
