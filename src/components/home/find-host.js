import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { sentInterviewRequest } from './Home';
import { sendconnectionRequest } from './Home';

import headers from "../config";
import ProfileCard, { CustomButton } from '../userCards/profileCards';

export default function FindHost() {
        const [loading, setloading] = useState(false); 
        const [people, setpeople] = useState([]); 
        const header = headers();


        useEffect(() => {
                if (header !== undefined) {
                        axios.get('http://localhost:3001/user/interviewer', header).then((res) => {
                                if (res.statusText === 'OK') {
                                        console.log(people)
                                        setpeople(res.data.data);
                                }
                        })
                }
        }, [])


  
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
                                                    <ProfileCard object={user._id} type={3}></ProfileCard>     
                                                )
                                        })}
                                </div>

                        </div>

                </div>
        )
}
