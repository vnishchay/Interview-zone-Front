import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { headers } from "../config";


export default function FindCandiate() {
    // const [link, setlink] = useState("");
    // const auth = useAuth();
    // const [email, setemail] = useState();
    // const history = useHistory();
    // const joinmeet = useRef("");
    // const [loading, setloading] = useState()
    // const [interview, setinterview] = useState([]);
    // const [interviewList, setinterviewList] = useState([]);
    // const url = process.env.REACT_APP_BASE_URL === undefined ? "http://localhost:3001" : process.env.REACT_APP_BASE_URL;

    // useEffect(() => {
    //     axios.get(url + '/interview/find', headers).then((res) => {
    //         var data = res.data.data;
    //         if (res && data) {
    //             console.log(data)
    //             data.forEach(element => setinterviewList((interviewList) => [...interviewList, element]));
    //         }
    //         console.log(interviewList)
    //     })
    // }, [])


    // useEffect(() => {
    //     if (auth.jwt == undefined || auth.user === undefined) {
    //         setemail("guest");
    //     } else {
    //         setemail(auth.user.email);
    //     }
    // }, [auth]);

    // const data =
    // {
    //     "typeOfInterview": "Job",
    //     "numberOfQuestions": 8,
    //     "levelOfQuestions": "medium",
    //     "interviewID": link,
    //     "idOfHost": auth.user.userid
    // }

    // const route = (e) => {
    //     e.preventDefault();
    //     history.push(link);
    // };

    // const joinMeet = (e) => {
    //     e.preventDefault();
    //     history.push(joinmeet.current.value);
    // };

    // const interviewID = v4()
    // const handleLogout = () => {
    //     auth.logout();
    //     history.push('/')
    // }

    // const saveInterviewData = async () => {
    //     setloading(true)
    //     try {
    //         if (data.interviewID !== undefined && data.idOfHost !== undefined)
    //             axios.post(url + '/interview/create', data, headers).then((res) => {
    //                 setinterview(res.data.data);
    //                 setloading(false)
    //             })
    //     } catch (err) {
    //         console.log("Can't Create an Interview" + err)
    //         setloading(false)
    //     }
    // }

    // useEffect(() => {
    //     saveInterviewData();
    // }, [])


    // return (
    //     <div className="homepage">
    //         <main>
    //             <div className="box1">
    //                 <img className="img-hm" src="images/undraw_positive_attitude_re_wu7d.svg"></img>
    //                 <div className="card" id="col1">
    //                     <div>
    //                         <div>
    //                             <h1> Place Interview Request </h1>
    //                             <button className="offset"> Submit Request </button>
    //                         </div>
    //                         <div justify="center">
    //                             <div >
    //                                 <button
    //                                     className="raise"
    //                                     onClick={() => navigator.clipboard.writeText(link)} y>
    //                                     {link !== ""
    //                                         ? window.location.href + link
    //                                         : "Create Link"}
    //                                 </button>
    //                                 <div className="mb-2">

    //                                 </div>
    //                                 <div></div>
    //                             </div>
    //                         </div>
    //                         <div container spacing={2} justifyContent="center">
    //                             <button
    //                                 className="raise"

    //                                 onClick={() => {
    //                                     setlink(`/setup/${interviewID}`)
    //                                     saveInterviewData();
    //                                 }}
    //                             >
    //                                 Create Interview
    //                             </button>
    //                         </div>
    //                         <div container spacing={2} justifyContent="center">
    //                             {<button
    //                                 className="raise"
    //                                 onClick={route}>
    //                                 Go to interview
    //                             </button>
    //                             }
    //                         </div>
    //                         {<div className="bx-jnm" >
    //                             <input className="inp-hm" ref={joinmeet}></input>
    //                             <button
    //                                 className="raise btn-meet"
    //                                 onClick={joinMeet}
    //                             >
    //                                 Join Meet
    //                             </button>
    //                         </div>
    //                         }
    //                         <Link to={'/setupInterview'}> <button className="offset"> Setup Interview </button>  </Link>
    //                     </div>
    //                 </div>
    //             </div>
    //             <div>
    //                 <h1>Find Interviewer</h1>
    //                 {
    //                     interviewList.length > 0 && interviewList.map((interview) => {
    //                         return <div className="card-interview"><ul key={interview._id}>
    //                             <li><h2>Interview ID</h2> {interview.interviewID}</li>
    //                             <li><h2>Level of Question</h2> {interview.levelOfQuestions}</li>
    //                             <li><h2>Number of questions</h2> {interview.numberOfQuestions}</li>
    //                             <li><h2>Type of Interview</h2> {interview.typeOfInterview}</li>
    //                             <button className="offset">Send Request</button>
    //                         </ul>
    //                         </div>
    //                     })
    //                 }
    //             </div>
    //             <div maxWidth="md"></div>
    //         </main>
    //     </div>
     return (<></>
    );
}

