import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { sentInterviewRequest } from './Home';
import { sendFollowRequest } from './Home';

import headers from "../config";

export default function FindHost() {
        const [loading, setloading] = useState(false); 
        const [people, setpeople] = useState([]);
        const [status , setstatus] = useState(); 
        const header = headers();
        useEffect(() => {
                if (header !== undefined) {
                        axios.get('http://localhost:3001/user/interviewer', header).then((res) => {
                                if (res.statusText === 'OK') {
                                        setpeople(res.data.data);
                                }
                        })
                }
        }, [])

     

        useEffect(()=>{
                if(status == 2) {
                        setloading(false); 
                }else if(status == 1) {
                        alert("To send interviwe Request, make connection first")
                }else if(status == 0){
                        alert("Something went wrong")
                }
        }, [status])

        return (
                <div>
                        <div className='searchbox-find'>
                                <input placeholder='Search for people' />
                                <button className='btn-0' onClick={()=> console.log('Search')}>Search</button>

                        </div>

                        <div className="boxContiner">
                                <div className="boxBody">
                                        {people && people.map((user, index) => {
                                                return (
                                                        <div className="card" key={index}>
                                                        <Link to={`/profile/${user.username}`}>
                                                             
                                                                        <div className="profileImage"></div>
                                                                        <div className="nameFamily">
                                                                                <p>{user.username}</p>
                                                                                <span>FrontEnd Developer</span>
                                                                        </div>
                                                                        </Link>
                                                         
                                                         <button className='btn-0' onClick={()=>{
                                                                 setloading(true); 
                                                                 sentInterviewRequest(user.username, setstatus )}
                                                                 } >{ !loading  ?  <>Interview Request  </> : <>...</>}</button>
                                                         
                                                         </div>
                                                )
                                        })}
                                </div>

                        </div>

                </div>
        )
}
