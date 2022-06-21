import React, { useState, useEffect, useRef } from "react";
import { v4 } from "uuid";
import { useAuth } from "../auth/authContext";
import { Redirect, useHistory } from "react-router-dom";
import "./_home.css"
import "./home.css"
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import Login from "../auth/login";
import axios from "axios";
import headers from "../config";


export const create = (history) => {
    const header = headers();
    const id = v4();
    try {
        if (header !== undefined) {
            axios.post('http://localhost:3001' + "/interview/create", { interviewID: id }, header).then((res) => {
                console.log(res)
                if (res.statusText === 'OK') {
                    axios.put('http://localhost:3001/')
                    history.push(`/setup/${id}`)
                }
            })
        }

    } catch (err) {
        console.log("Can't Create an Interview" + err)
    }

}


export default function Home() {
    const { state } = useAuth();
    const history = useHistory();
    const [url, seturl] = useState();
    const find = () => {
        const header = headers();
        const id = url.split('/');
        console.log(id[id.length - 1])
        if (header !== undefined) {
            axios.post('http://localhost:3001/interview/findfilter', { interviewID: id[id.length - 1] }, header).then(res => {
                if (res.statusText === 'OK') {
                    console.log(res);
                    if (res.data.data && res.data.data.length > 0) {
                        const id = res.data.data[0].id;
                        axios.post('http://localhost:3001/interview/update/' + id, { idOfParticipant: 'update' }, header).then(res => {
                            history.push('/setup/' + id);
                        })
                    }
                }
            }
            )
        }
    }
    return (
        <div>
            {state.isAuthenticated ?
                <>
                    <Navbar></Navbar>

                    <section className="c-section">
                        <h2 className="c-section__title"><span>Interview Zone </span></h2>
                        <ul className="c-services">
                            <div className="c-services__item">
                                <h3>practice, prepare for interview</h3>
                                <p>We leverage the concept of mobile-first design. Through our work, we focus on designing an experience that works across different screen sizes.</p>
                            </div>
                            <div className="c-services__item">
                                <Link to="/find-host"> <h3>Find interviewer</h3>
                                    <button className="raise"> Start Now </button>
                                </Link>
                            </div>

                            <div className="c-services__item">
                                <h3>Create Interview Now </h3>
                                <p>
                                    <button onClick={() => create(history)} >Start Here !</button>
                                </p>
                            </div>
                            <div className="c-services__item" style={{ background: "#7DEBB7" }}>
                                <h3>Join using Link</h3>
                                <br></br>
                                <div className="inputWithButton">
                                    <div className="item">
                                        <input className="searchInpt" type="text" placeholder="Join Interview" onChange={(e) => seturl(e.target.value)} />
                                    </div>
                                    <div className="item">
                                        <button className="btnSearch btnAqua" onClick={find}>

                                            <i className="icon">
                                                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0 3.76172H10.6172L7.94531 1.05469L9 0L13.5 4.5L9 9L7.94531 7.94531L10.6172 5.23828H0V3.76172Z" fill="white" />
                                                </svg>
                                            </i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="c-services__item">
                                <h3>Screen Sharing : future </h3>
                                <p>To reach more customers and the goals of your business, a mobile application is necessary these days. We will work on the app design from scratch to final tested prototype.</p>
                            </div>
                            <div className="c-services__item">
                                <Link to="/find-candidate">
                                    <h3>Get Interview Now</h3>
                                    <button className="raise">Start Now</button>
                                </Link>
                            </div>
                        </ul>

                    </section>
                </> : <Login></Login>
            }
        </div>

    );
}
