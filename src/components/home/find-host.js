import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import headers  from "../config";

export default function FindHost() {
        const [people, setpeople] = useState([]);
        const header = headers(); 
        useEffect(() => {
                if(header !== undefined) {
                
                axios.get('http://localhost:3001/user/interviewer', header).then((res) => {
                         if(res.statusText === 'OK') {
                                setpeople(res.data.data); 
                         }
                })}
        }, [])
        return (
                <div>
                        <h1>Explore </h1>
                        <div className="boxContiner">
                                <div className="boxBody">
                        { people && people.map((user, index )=> {
                                    return (   
                                        <Link to= {`/profile/${user.username}`}>
                                        <div className="card">
                                                <div className="profileImage"></div>
                                                <div className="nameFamily">
                                                        <p>{user.username}</p>
                                                        <span>FrontEnd Developer</span>
                                                </div>
                                                <div className="numbers">
                                                        <div className='socialMediaSingle'>
                                                                <span>103</span>
                                                                <p>Post</p>
                                                        </div>
                                                        <div className='socialMediaSingle'>
                                                                <span>203</span>
                                                                <p>Followers</p>
                                                        </div>
                                                        <div className='socialMediaSingle'>
                                                                <span>333</span>
                                                                <p>Following</p>
                                                        </div>
                                                </div>

                                                <div className="linkBtnk">
                                                        <a href="">Message</a>
                                                </div>
                                                <div className="socialMedia">
                                                        <div className="mail">

                                                        </div>
                                                        <div className="linkdin">

                                                        </div>
                                                        <div className="phone">
                                                        </div>
                                                </div>
                                        </div>
                                        </Link>
)})} 
                                </div>

                        </div>

                </div>
        )
}
