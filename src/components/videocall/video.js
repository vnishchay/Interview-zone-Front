import React, { useEffect, useRef, useState } from "react";
import Peer from 'simple-peer'
import sock from "../socket";
import "./video.css";
import { useParams } from "react-router";

export default function Video({ constraints }) {
  const { id: videoID } = useParams();
  const [receivingCall, setReceivingCall] = useState(false);
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const [initiateCall, setinitiateCall] = useState(false);

  const [isvideo, setisvideo] = useState(constraints.isvideo);
  const [isaudio, setisaudio] = useState(constraints.isaudio);

  function toggleVideo() {
    if (myVideo.current.srcObject != null && myVideo.current.srcObject.getVideoTracks().length > 0) {
      setisvideo(!isvideo);
      myVideo.current.srcObject.getVideoTracks()[0].enabled = isvideo;
    }
  }

  function toggleMic() {
    if (myVideo.current.srcObject != null && myVideo.current.srcObject.getAudioTracks().length > 0) {
      setisaudio(!isaudio);
      myVideo.current.srcObject.getAudioTracks()[0].enabled = isaudio;
    }
  }

  useEffect(() => {
    sock.emit("video-call", videoID);
    sock.on("callUser", (data) => {
      setReceivingCall(true);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    sock.on("audiocallUser", (data) => {
      setReceivingCall(true);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        myVideo.current.srcObject = stream;
      });
  }, []);

  const callUser = () => {
    console.log("Call initiated")
    setinitiateCall(true);
    setCallEnded(false);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: myVideo.current.srcObject,
    });

    peer.on("signal", (data) => {
      sock.emit("callUser", {
        userToCall: videoID,
        signalData: data,
        name: name,
      });
    });
    if (userVideo == null) return;
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    sock.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };


  const answerCall = (e) => {
    e.preventDefault()
    setinitiateCall(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: myVideo.current.srcObject,
    });

    setCallAccepted(true);
    setCallEnded(false);
    peer.on("signal", (data) => {
      sock.emit("answerCall", { signal: data, to: videoID });
    });
    if (userVideo == null) return;
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };
  // to leave the  call
  const leaveCall = () => {
    setinitiateCall(false);
    setCallEnded(true);
    setCallAccepted(false);
    setReceivingCall(false);
    userVideo.current = undefined;
    connectionRef.current = undefined;
    myVideo.current = undefined;
    setCallerSignal(undefined);
  };


  return (
    <div className="container-2">
      <div className="" style={{ width: "50 px" }}>
        <div>
          {receivingCall && !callAccepted &&
            <button className="fill" onClick={answerCall}>
              Answer
            </button>
          }
        </div>

        <div className='col'>
          <div className='row'>
            {isvideo && <button className='slide setup-button row' onClick={toggleVideo}><img className='setup-button' src='/images/video.png'></img></button>}
            {!isvideo && <button className='slide setup-button row' onClick={toggleVideo}><img className='setup-button' src='/images/novideo.png'></img></button>}
            {isaudio && <button className='slide setup-button row' onClick={toggleMic}><img className='setup-button' src='/images/microphone.png'></img></button>}
            {!isaudio && <button className='slide setup-button row' onClick={toggleMic}><img className='setup-button' src='/images/mute.png'></img></button>}
          </div>
        </div>
        <div className="b2">
          {callAccepted && !callEnded ? (
            <button onClick={leaveCall}>
              End Call
            </button>
          ) : (<button className="b12"
            color="primary"
            aria-label="call"
            onClick={callUser}
          >
            Phone
            {/* <PhoneIcon fontSize="small" /> */}
          </button>
          )}

        </div>
        <div className="b3"></div>
      </div>
      <div className="v1">
        <div className="video-1 ">
          {myVideo ? (
            <div>
              <video className="video-1"
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ height: "auto", width: "15em" }}
              />
              <div>Interviwer</div>
            </div>

          ) : (

            < div />
          )
          }
        </div>

      </div>
      <div className="v2">
        <div className="video-2">
          <video className="video-2"
            playsInline
            ref={userVideo}
            autoPlay
            style={{ height: "auto", width: "15em" }}
          />
          <div>Candidate</div>
        </div>
      </div>
    </div>
  )
}

