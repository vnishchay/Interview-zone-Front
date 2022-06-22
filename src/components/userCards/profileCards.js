import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headers from "../config";
import "./profileCards.css"
import { acceptInterview, sendconnectionRequest, sentInterviewRequest } from "../home/Home";
import { acceptConnection } from "../home/Home";
 
export const CustomButton = ({username, type})=>{
    const [isloading , setisloading] = useState(); 
    return (
           <>
             {type===1 &&  <button className="btn-0" onClick={() => sentInterviewRequest(username)} >Interview Request</button>}
             {type==2 &&  <button className="btn-0" onClick={() => acceptConnection(username)} >Accept Connection Request</button>}
            

             {type ==3 &&  <button className="btn-0" onClick={() => sendconnectionRequest(username)} >Connect</button>}
             {type ==4  &&  <button className="btn-0" onClick={() => sentInterviewRequest(username)} >Delete Interview Request</button>}
             {/* to delete sent request, connection request */}
             {type ==5  &&  <button className="btn-0" onClick={() => sentInterviewRequest(username)} >Delete Connection Request</button>}
             {type ==6  &&  <button className="btn-0" onClick={() => sentInterviewRequest(username)} >Remove Connection</button>}
             {type==7 &&  <button className="btn-0" onClick={() =>  acceptInterview(username)} >Accept Interview Request</button>}
             {/* {type==8 &&  <button className="btn-0" onClick={() =>  (username)} >Configure Interview</button>} */}
          </>
       )
}

const ProfileCard = ({ object, type }) => {
    const header = headers();
    const [data, setdata] = useState();
    useEffect(() => {
        if (header !== undefined) {
            axios.post('http://localhost:3001/user/getUserById', { id: object }, header).then(res => {
                console.log(res)
                if (res.statusText === 'OK') {
                    setdata(res.data.data)
                }
            })
        }
    }, [])
    return (
        <>
            {data &&
                <div >
                    <div className="card">
                        <div>
                            <Link to={`/profile/${data.username}`}>
                                <div className="profileImage"></div>
                                <div className="nameFamily">
                                    <p>{data.username}</p>
                                    <span>FrontEnd Developer</span>
                                </div>
                            </Link>
                            <CustomButton id={data._id} type={type}></CustomButton>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ProfileCard; 