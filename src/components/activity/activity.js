import axios from "axios";
import { useEffect, useState } from "react"
import headers from "../config";
import ProfileCard from "../userCards/profileCards"
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
                    <ul className="data-user">
                        {data.user.interviews && data.user.interviews.length > 0 ? data.user.interviews.map((interview, index)=>{
                                 return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Follow Requests </div>
                        }
                    </ul>
                    <div>Connections </div>
                    <ul className="">
                        {data.user.connections && data.user.connections.length > 0 ?  data.user.connections.map((interview, index)=>{
                                return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Connections </div>
                    }
                    </ul>
                    <div> Follow Requests  </div>
                    <ul className="">
                        {data.user.pendingFollowers && data.user.pendingFollowers.length > 0  ? data.user.pendingFollowers.map((interview, index)=>{
                                return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Follow Requests </div>
                    }
                    </ul>
                    <div>Followers </div>
                    <ul className="">
                        {data.user.followers && data.user.followers.length > 0 ? data.user.followers.map((interview, index)=>{
                               return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Followers </div>
                        }
                    </ul>

                    <div>Following </div>
                    <ul className="">
                        {data.user.following && data.user.following.length > 0 ? data.user.following.map((interview, index)=>{
                                 return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Following </div>
                    }
                    </ul>

                    <div> Sent Connection Requests </div>
                    <ul className="">
                        {data.user.sentConnectionRequests && data.user.sentConnectionRequests >0 ? data.user.sentConnectionRequests.map((interview, index)=>{
                              
                              return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No Requests </div>
                        }
                    </ul>

                    <div> Connection Requests </div>
                    <ul className="">
                        {data.user.connectionRequests  && data.user.connectionRequests.length >0 ?  data.user.connectionRequests.map((interview, index)=>{
                                return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No  Requests </div>
                      }
                    </ul>
                    
                    <div> Sent Requests </div>
                    <ul className="">
                        {data.user.sentInterviewRequest && data.user.sentInterviewRequest.length > 0 ? data.user.sentInterviewRequest.map((interview, index)=>{
                               return <ProfileCard object={interview}></ProfileCard>
                        })
                        : <div className="activity-not-found"> No  Requests </div>
                    }
                    </ul>


                    <div> Interview Requests </div>
                    <ul className="">
                        {data.user.interviewRequest && data.user.interviewRequest.length > 0? data.user.interviewRequest.map((interview, index)=>{
                                 return <ProfileCard object={interview}></ProfileCard>
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