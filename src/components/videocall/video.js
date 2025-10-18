import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import sock from "../socket";
import "./video.css";
import { useParams } from "react-router";

export default function Video({
  hostName,
  candidateName,
  currentUserName,
  logger,
}) {
  const { id: videoID } = useParams();
  const myVideo = useRef();
  const userVideo = useRef();
  const peerRef = useRef();
  const streamRef = useRef();

  const [isvideo, setisvideo] = useState(true);
  const [isaudio, setisaudio] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [remotePeerName, setRemotePeerName] = useState("");

  const myName = currentUserName || hostName;
  const otherUserName = currentUserName === hostName ? candidateName : hostName;

  function toggleVideo() {
    if (streamRef.current && streamRef.current.getVideoTracks().length > 0) {
      const newVideoState = !isvideo;
      setisvideo(newVideoState);
      streamRef.current.getVideoTracks()[0].enabled = newVideoState;
      console.log("[VIDEO] Toggled video:", newVideoState);

      // Log the action
      if (logger && logger.logVideoToggle) {
        logger.logVideoToggle(newVideoState);
      }
    }
  }

  function toggleMic() {
    if (streamRef.current && streamRef.current.getAudioTracks().length > 0) {
      const newAudioState = !isaudio;
      setisaudio(newAudioState);
      streamRef.current.getAudioTracks()[0].enabled = newAudioState;
      console.log("[VIDEO] Toggled audio:", newAudioState);

      // Log the action
      if (logger && logger.logAudioToggle) {
        logger.logAudioToggle(newAudioState);
      }
    }
  }

  useEffect(() => {
    console.log(
      "[VIDEO] Initializing video for user:",
      myName,
      "in room:",
      videoID
    );
    let localStream = null;

    // Step 1: Get local media (independent of connection)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        console.log("[VIDEO] Got local media stream");
        localStream = stream;
        streamRef.current = stream;

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        // Step 2: Join the room
        sock.emit("video-call", { roomId: videoID, userName: myName });
        console.log("[VIDEO] Emitted video-call to join room");

        // Step 3: Handle room info
        sock.on("room-info", (data) => {
          console.log("[VIDEO] Room info:", data);

          if (data.userCount === 2) {
            // We're second user - initiate connection
            console.log("[VIDEO] Initiating peer connection as second user");
            createPeer(stream);
          } else {
            console.log("[VIDEO] First user in room, waiting...");
          }
        });

        // Step 4: Handle incoming offer (we're the receiver)
        sock.on("offer", (data) => {
          console.log(
            "[VIDEO] Received offer from:",
            data.userName,
            "socket:",
            data.from
          );
          setRemotePeerName(data.userName);

          if (!peerRef.current) {
            answerPeer(data.signal, data.from, stream);
          }
        });

        // Step 5: Handle answer to our offer (we're the initiator)
        sock.on("answer", (data) => {
          console.log("[VIDEO] Received answer");

          if (peerRef.current) {
            peerRef.current.signal(data.signal);
          }
        });

        // Step 6: Handle ICE candidates
        sock.on("ice-candidate", (data) => {
          console.log("[VIDEO] Received ICE candidate");

          if (peerRef.current) {
            try {
              peerRef.current.signal(data.candidate);
            } catch (err) {
              console.error("[VIDEO] ICE candidate error:", err);
            }
          }
        });

        // Step 7: Handle user joining (we're already in room)
        sock.on("user-joined", (data) => {
          console.log("[VIDEO] User joined:", data.userName);
          setRemotePeerName(data.userName);
          // Don't create peer here - the new user will initiate
        });

        // Step 8: Handle user leaving
        sock.on("user-left", (data) => {
          console.log("[VIDEO] User left:", data.userName);

          if (userVideo.current) {
            userVideo.current.srcObject = null;
          }

          setIsConnected(false);
          setRemotePeerName("");

          if (peerRef.current) {
            peerRef.current.destroy();
            peerRef.current = null;
          }
        });
      })
      .catch((err) => {
        console.error("[VIDEO] Media error:", err);
        alert(`Cannot access camera/microphone: ${err.message}`);
      });

    // Create peer (initiator)
    function createPeer(stream) {
      console.log("[VIDEO] Creating peer as initiator");

      const peer = new Peer({
        initiator: true,
        trickle: true,
        stream: stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      peer.on("signal", (signal) => {
        console.log("[VIDEO] Sending offer to room:", videoID);
        sock.emit("offer", {
          roomId: videoID,
          signal: signal,
          userName: myName,
        });
      });

      peer.on("stream", (remoteStream) => {
        console.log("[VIDEO] Received remote stream");

        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }

        setIsConnected(true);
      });

      peer.on("error", (err) => {
        console.error("[VIDEO] Peer error:", err);
        setIsConnected(false);
      });

      peer.on("close", () => {
        console.log("[VIDEO] Peer closed");
        setIsConnected(false);
      });

      peer.on("connect", () => {
        console.log("[VIDEO] Peer connected successfully!");
        setIsConnected(true);
      });

      peerRef.current = peer;
    }

    // Answer peer (receiver)
    function answerPeer(incomingSignal, callerSocketId, stream) {
      console.log(
        "[VIDEO] Creating peer as receiver, will answer to:",
        callerSocketId
      );

      const peer = new Peer({
        initiator: false,
        trickle: true,
        stream: stream,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      peer.on("signal", (signal) => {
        console.log("[VIDEO] Sending answer to caller:", callerSocketId);
        sock.emit("answer", {
          signal: signal,
          to: callerSocketId,
        });
      });

      peer.on("stream", (remoteStream) => {
        console.log("[VIDEO] Received remote stream");

        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }

        setIsConnected(true);
      });

      peer.on("error", (err) => {
        console.error("[VIDEO] Peer error:", err);
        setIsConnected(false);
      });

      peer.on("close", () => {
        console.log("[VIDEO] Peer closed");
        setIsConnected(false);
      });

      peer.on("connect", () => {
        console.log("[VIDEO] Peer connected successfully!");
        setIsConnected(true);
      });

      peer.signal(incomingSignal);
      peerRef.current = peer;
    }

    // Cleanup
    return () => {
      console.log("[VIDEO] Cleaning up");

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
          console.log("[VIDEO] Stopped track:", track.kind);
        });
      }

      if (peerRef.current) {
        peerRef.current.destroy();
      }

      sock.off("room-info");
      sock.off("offer");
      sock.off("answer");
      sock.off("ice-candidate");
      sock.off("user-joined");
      sock.off("user-left");
    };
  }, [videoID, myName]);

  return (
    <div className="video-container-wrapper">
      <div className="video-controls">
        <div className="control-buttons">
          <button
            className={`control-btn ${!isvideo ? "disabled" : ""}`}
            onClick={toggleVideo}
            title={isvideo ? "Turn off camera" : "Turn on camera"}
          >
            {isvideo ? "📹" : "🚫📹"}
          </button>
          <button
            className={`control-btn ${!isaudio ? "disabled" : ""}`}
            onClick={toggleMic}
            title={isaudio ? "Mute microphone" : "Unmute microphone"}
          >
            {isaudio ? "🎤" : "🔇"}
          </button>
        </div>

        {isConnected && (
          <div className="connection-status">
            <span className="status-dot"></span>
            <span>Connected</span>
          </div>
        )}
      </div>

      <div className="videos-grid">
        <div className="video-wrapper my-video-wrapper">
          <video
            className="video-element"
            playsInline
            muted
            ref={myVideo}
            autoPlay
          />
          <div className="video-label">
            <span className="username-badge">{myName} (You)</span>
          </div>
        </div>

        <div className="video-wrapper peer-video-wrapper">
          <video
            className="video-element"
            playsInline
            ref={userVideo}
            autoPlay
          />
          <div className="video-label">
            <span className="username-badge">
              {remotePeerName || otherUserName}
            </span>
          </div>
          {!isConnected && (
            <div className="waiting-overlay">
              <p>Waiting for {otherUserName} to join...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
