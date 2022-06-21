import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headers from "../config";
import "./profileCards.css"
import { sendconnectionRequest, sentInterviewRequest } from "../home/Home";
import { sendFollowRequest } from "../home/Home";


const ProfileCard = ({object}) => {

    const header = headers();
    const [data, setdata] = useState();
    useEffect(() => {
        if(header !== undefined ) {
       
        axios.post('http://localhost:3001/user/getUserById', { id : object }, header ).then(res => {
            console.log(res)
            if (res.statusText === 'OK') {
                setdata(res.data.data)
            }
        })} 
    }, [])

    return (
        <>
            {data &&
                <div >
                     <Link to={`/profile/${data.username}`}>
                                                                <div className="card">
                                                                        <div className="profileImage"></div>
                                                                        <div className="nameFamily">
                                                                                <p>{data.username}</p>
                                                                                <span>FrontEnd Developer</span>
                                                                        </div>
                                        
                                                                        <div className="linkBtnk">
                                                                                <button onClick={() => sentInterviewRequest(data.username)} >Interview Request</button>
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
                </div>
            }
        </>
    )
}

export default ProfileCard; 