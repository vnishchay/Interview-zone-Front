import axios from "axios";
import e from "cors";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headers from "../config";
import "./profileCards.css"
 
export const CustomButton = ({id, type})=>{
    const [loading , setloading] = useState(false); 
    const [isdone , setisdone] = useState(false); 
    const header = headers(); 

 const sentInterviewRequest = ()=>{
    setloading((pre)=>true)
    const header = headers();  
    if(header !== undefined) {
        axios.post('http://localhost:3001/user/interviewRequest', {id : id }, header).then((res)=>{
               console.log(res)
               if(res.statusText === 'OK'){
                      if(res.data.isConnection == false ) {
                              alert('Make connection first') 
                              setisdone((pre)=>false); 
                              setloading((pre)=>false); 
                      }else {
                      setloading((pre)=> false ); 
                      setisdone((pre)=> true); 
                      } 
                     
               }else {
                   setloading((pre)=>false); 
                   setisdone((pre)=>false); 
                   return alert('Some Error')

               }
        })
    }
}


 const sendconnectionRequest = ()=>{
 setloading((pre)=>true)
 const header = headers(); 
 if(header !== undefined) {
     axios.post('http://localhost:3001/user/connectionrequest', {id : id }, id).then((res)=>{
            console.log(res)
            if(res.statusText === 'OK'){
                 setloading((pre)=> false); 
                 setisdone((pre) => true ) ; 
            }else {
                 setloading((pre)=>false); 
                 setisdone((pre)=>false); 
                 return alert('Some Error')
            }
     })
 }
}



const acceptConnection = async()=>{
    setloading((pre)=>true)
 const header = headers(); 
 axios.post('http://localhost:3001/user/acceptConnection', {id : id}, header).then((res)=> {
    if(res.statusText === 'OK'){
        setloading((pre)=> false); 
        setisdone((pre) => true ) ; 
   }else {
        setloading((pre)=>false); 
        setisdone((pre)=>false); 
        return alert('Some Error')
   }
 })
}

 const deleteConnectionRequest = async()=>{
    setloading((pre)=>true)
 const header = headers(); 
 axios.post('http://localhost:3001/user/deleteConnectionRequest', {id : id}, header).then((res)=> {
    if(res.statusText === 'OK'){
        setloading((pre)=> false); 
        setisdone((pre) => true ) ; 
   }else {
        setloading((pre)=>false); 
        setisdone((pre)=>false); 
        return alert('Some Error')
   }
 })
}

const acceptInterview = async()=>{ 
 setloading((pre)=>true)
 const header = headers(); 
 axios.post('http://localhost:3001/user/acceptInterview', {id : id}, header).then((res)=> {
    if(res.statusText === 'OK'){
        setloading((pre)=> false); 
        setisdone((pre) => true ) ; 
   }else {
        setloading((pre)=>false); 
        setisdone((pre)=>false); 
        return alert('Some Error')
   } 
 })
}


    return (
           <>
           { 
            isdone ? <div>Done</div> : 
            <>
             {type===1 &&  <button className="btn-0" onClick={sentInterviewRequest} >{ !loading ? <>Interview Request </> : <>...</>}</button>}
             {type==2 &&  <button className="btn-0" onClick={acceptConnection} >{ !loading ? <> Accept Connection Request </> : <>...</>}</button>}
             {type ==3 &&  <button className="btn-0" onClick={sendconnectionRequest} >{ !loading ? <> Connect </> : <>...</>}</button>}
             {type ==4  &&  <button className="btn-0" onClick={acceptInterview} >{ !loading ? <> Accept Interview Request </> : <>...</>}</button>}
             {type ==5  &&  <button className="btn-0" onClick={deleteConnectionRequest} >{ !loading ? <> Delete Connection Request </> : <>...</>}</button>}
             {type ==6  &&  <button className="btn-0" onClick={()=>console.log("TO be implemented")} >Remove Connection</button>}
             {type==7 &&  <button className="btn-0" onClick={()=>console.log("TO be implemented")} >Accept Interview Request</button>}
             {type==8 &&  <button className="btn-0" onClick={()=>console.log("TO be implemented")}>Proceed</button>} 
             </>
             } 
             </>
             
       )
}

const ProfileCard = ({ object, type }) => {

    const header = headers();
    const [data, setdata] = useState();
    console.log(object)
    useEffect(() => {
        if (header !== undefined) {
            axios.post('http://localhost:3001/user/getUserById', { id : object }, header).then(res => {
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





export const InterviewCard = ({id, type })=>{
       console.log(id); 
       const header = headers(); 
       const [interview , setinterview] = useState(); 
       useEffect(()=>{
              
              axios.post('http://localhost:3001/interview/findById', {id : id} , header).then((res )=>{
                      if(res.statusText === 'OK') {
                          console.log(res.data)
                          setinterview(res.data.data) 
                      }
              })
       }, [])
       return  (
        <div className="card">{
            interview && 
        <div>
            <Link to={`/setup/${interview.interviewID}`}>

                <div className="nameFamily">
                    <div>{interview.level}</div>
                    <div>host : {interview.hostname}</div>
                    <div>candidate : {interview.candidatename}</div>
                    <div>level : {interview.levelOfQuestions}</div>
                </div>
            </Link>
            <CustomButton id={interview._id} type={type}></CustomButton>
        </div>
}   
    </div>
       )
}