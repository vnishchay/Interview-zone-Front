import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import headers from "../config";
import "./profileCards.css"
import { acceptInterview, deleteConnectionRequest, sendconnectionRequest, sentInterviewRequest } from "../home/Home";
import { acceptConnection } from "../home/Home";
 
export const CustomButton = ({id, type})=>{
    const [loading , setloading] = useState(false); 
    const [isdone , setisdone] = useState(false); 

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
             {type ==4  &&  <button className="btn-0" onClick={acceptInterview} >{ !loading ? <> Delete Interview Request </> : <>...</>}</button>}
             {type ==5  &&  <button className="btn-0" onClick={deleteConnectionRequest} >{ !loading ? <> Delete Connection Request </> : <>...</>}</button>}
             {type ==6  &&  <button className="btn-0" onClick={()=>console.log("TO be implemented")} >Remove Connection</button>}
             {type==7 &&  <button className="btn-0" onClick={()=>console.log("TO be implemented")} >Accept Interview Request</button>}
             {type==8 &&  <button className="btn-0" onClick={()=>console.log("TO be implemented")}>Delete</button>} 
             </>
             } 
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
                            <Link to={`/profile/${data.id}`}>
                                <div className="profileImage"></div>
                                <div className="nameFamily">
                                    <p>{data.id}</p>
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


