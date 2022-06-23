import axios from "axios";
import { useEffect, useState } from "react"
import headers from "../config";
import ProfileCard, { InterviewCard } from "../userCards/profileCards"
import './activity.css'
const Activity = ()=>{
      const [data,setdata ] = useState(); 
      const header = headers(); 
      useEffect(()=>{
            axios.get('http://localhost:3001/user/profile', header).then(res=>{
                  if(res.statusText ==='OK') {
                        setdata(res.data)
                  }
            }) 
      },[])
      return (
        <div> { data && 
            <div className="activity">
                <div>Interviews </div>
                    <ul className="grid">
                        {data.user.interviews && data.user.interviews.length > 0 ? data.user.interviews.map((interview, index)=>{
                                 return <InterviewCard id={interview} type={8}></InterviewCard>
                        })
                        : <div className="activity-not-found"> No Follow Requests </div>
                        }
                    </ul>
                    <div>Connections </div>
                    <ul className="grid">
                        {data.user.connections && data.user.connections.length > 0 ?  data.user.connections.map((interview, index)=>{
                                return <ProfileCard object={interview} type={6}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Connections </div>
                    }
                    </ul>
                   

                   

                    <div> Sent Connection Requests </div>
                    <ul className="grid">
                        {data.user.sentConnectionRequest && data.user.sentConnectionRequest.length >0 ?  data.user.sentConnectionRequest.map((interview, index)=>{
                              return <ProfileCard object={interview} type={8}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Requests </div>
                        }
                    </ul>

                    <div>Incoming Connection Requests </div>
                    <ul className="grid">
                        {data.user.connectionRequests  && data.user.connectionRequests.length >0 ?  data.user.connectionRequests.map((interview, index)=>{
                                return <ProfileCard object={interview} type={5}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No  Requests </div>
                      }
                    </ul>
                    
                    <div> Sent Interview Requests </div>
                    <ul className="grid">
                        {data.user.sentInterviewRequest && data.user.sentInterviewRequest.length > 0 ? data.user.sentInterviewRequest.map((interview, index)=>{
                               return <ProfileCard object={interview} type={4}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No  Requests </div>
                    }
                    </ul>


                    <div>Incoming Interview Requests </div>
                    <ul className="grid">
                        {data.user.interviewRequest && data.user.interviewRequest.length > 0? data.user.interviewRequest.map((interview, index)=>{
                                 return <ProfileCard object={interview} type={4}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No  Requests </div>
                        }
                    </ul>
                    </div>
                    } 
        </div>
      )
}

export default Activity ; 