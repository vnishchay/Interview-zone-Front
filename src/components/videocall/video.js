import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import sock from "../socket";
import "./video.css";
import { useParams } from "react-router-dom";

export default function Video({
  hostName,
  candidateName,
  currentUserName,
  authUserName,
  authUserId,
  hostId,
  participantId,
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

  // Label for local video: show 'You' plus name if available
  const displayMyName = authUserName || currentUserName || "You";
  const myName = `${displayMyName} (You)`;

  // Determine other user's label safely:
  // 1) Prefer the socket-provided remotePeerName (most accurate)
  // 2) If not available, deduce using IDs: if authUserId equals hostId then other is candidateName, else hostName
  // 3) Fall back to host/candidate names
  // 4) Fallback generic label
  let otherUserName = "Other";
  if (remotePeerName) {
    otherUserName = remotePeerName;
  } else if (authUserId && hostId && String(authUserId) === String(hostId)) {
    otherUserName = candidateName || "Candidate";
  } else if (
    authUserId &&
    participantId &&
    String(authUserId) === String(participantId)
  ) {
    otherUserName = hostName || "Host";
  } else if (hostName || candidateName) {
    // if we can't tell by id, prefer showing the hostname for the other pane
    otherUserName = hostName || candidateName || "Other";
  }

  function toggleVideo() {
    if (streamRef.current && streamRef.current.getVideoTracks().length > 0) {
      const newVideoState = !isvideo;
      setisvideo(newVideoState);
      streamRef.current.getVideoTracks()[0].enabled = newVideoState;
      try {
        if (logger && typeof logger.logVideoToggle === "function") {
          logger.logVideoToggle(newVideoState);
        }
      } catch (e) {
        /* swallow */
      }
    }
  }

  function toggleMic() {
    if (streamRef.current && streamRef.current.getAudioTracks().length > 0) {
      const newAudioState = !isaudio;
      setisaudio(newAudioState);
      streamRef.current.getAudioTracks()[0].enabled = newAudioState;
      // Log the action (non-blocking). Avoid console output in production.
      try {
        if (logger && typeof logger.logAudioToggle === "function") {
          logger.logAudioToggle(newAudioState);
        }
      } catch (e) {
        /* swallow logging errors */
      }
    }
  }

  useEffect(() => {
    try {
      if (logger && typeof logger.logAction === "function") {
        logger.logAction("video_init", { myName, videoID });
      }
    } catch (e) {
      /* swallow */
    }
    let localStream = null;

    // Step 1: Get local media (independent of connection)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("media_acquired", { videoID });
          }
        } catch (e) {
          /* swallow */
        }
        localStream = stream;
        streamRef.current = stream;

        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }

        // Step 2: Join the room
        sock.emit("video-call", { roomId: videoID, userName: myName });

        // Step 3: Handle room info
        sock.on("room-info", (data) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("room_info", { data });
            }
          } catch (e) {
            /* swallow */
          }
          if (data.userCount === 2) {
            // We're second user - initiate connection
            createPeer(stream);
          }
        });

        // Step 4: Handle incoming offer (we're the receiver)
        sock.on("offer", (data) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("received_offer", {
                from: data.from,
                userName: data.userName,
              });
            }
          } catch (e) {
            /* swallow */
          }
          setRemotePeerName(data.userName);

          if (!peerRef.current) {
            answerPeer(data.signal, data.from, stream);
          }
        });

        // Step 5: Handle answer to our offer (we're the initiator)
        sock.on("answer", (data) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("received_answer", {});
            }
          } catch (e) {
            /* swallow */
          }

          if (peerRef.current) {
            peerRef.current.signal(data.signal);
          }
        });

        // Step 6: Handle ICE candidates
        sock.on("ice-candidate", (data) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("ice_candidate", {});
            }
          } catch (e) {
            /* swallow */
          }

          if (peerRef.current) {
            try {
              peerRef.current.signal(data.candidate);
            } catch (err) {
              try {
                if (logger && typeof logger.logAction === "function") {
                  logger.logAction("ice_error", {
                    error: err && err.message ? err.message : String(err),
                  });
                }
              } catch (e) {
                /* swallow */
              }
            }
          }
        });

        // Step 7: Handle user joining (we're already in room)
        sock.on("user-joined", (data) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("user_joined", { userName: data.userName });
            }
          } catch (e) {
            /* swallow */
          }
          setRemotePeerName(data.userName);
          // Don't create peer here - the new user will initiate
        });

        // Step 8: Handle user leaving
        sock.on("user-left", (data) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("user_left", { userName: data.userName });
            }
          } catch (e) {
            /* swallow */
          }

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
        // Local leave: another part of the app (Leave button) may emit this
        // to request local cleanup without disconnecting the entire socket.
        sock.on("leave-room", (data) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("local_leave", { data });
            }
          } catch (e) {
            /* swallow */
          }

          // Mirror the user-left cleanup for local leave
          if (userVideo.current) {
            try {
              userVideo.current.srcObject = null;
            } catch (e) {
              /* swallow */
            }
          }

          setIsConnected(false);
          setRemotePeerName("");

          if (peerRef.current) {
            try {
              peerRef.current.destroy();
            } catch (e) {
              /* swallow */
            }
            peerRef.current = null;
          }

          // Stop local stream tracks
          if (streamRef.current) {
            try {
              streamRef.current.getTracks().forEach((t) => t.stop());
            } catch (e) {
              /* swallow */
            }
            streamRef.current = null;
          }
        });

        // Also listen for an in-page local event (dispatched by control panel)
        const onLocalLeave = (ev) => {
          try {
            if (logger && typeof logger.logAction === "function") {
              logger.logAction("local_leave_event", { detail: ev.detail });
            }
          } catch (e) {
            /* swallow */
          }

          if (userVideo.current) {
            try {
              userVideo.current.srcObject = null;
            } catch (e) {
              /* swallow */
            }
          }

          setIsConnected(false);
          setRemotePeerName("");

          if (peerRef.current) {
            try {
              peerRef.current.destroy();
            } catch (e) {
              /* swallow */
            }
            peerRef.current = null;
          }

          if (streamRef.current) {
            try {
              streamRef.current.getTracks().forEach((t) => t.stop());
            } catch (e) {
              /* swallow */
            }
            streamRef.current = null;
          }
        };

        window.addEventListener("local-leave", onLocalLeave);
      })
      .catch((err) => {
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("media_error", {
              message: err && err.message ? err.message : String(err),
            });
          }
        } catch (e) {
          /* swallow */
        }
        alert(`Cannot access camera/microphone: ${err.message}`);
      });

    // Create peer (initiator)
    function createPeer(stream) {
      try {
        if (logger && typeof logger.logAction === "function") {
          logger.logAction("creating_peer_initiator", {});
        }
      } catch (e) {
        /* swallow */
      }

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
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("sending_offer", { videoID });
          }
        } catch (e) {
          /* swallow */
        }
        sock.emit("offer", {
          roomId: videoID,
          signal: signal,
          userName: myName,
        });
      });

      peer.on("stream", (remoteStream) => {
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("remote_stream", {});
          }
        } catch (e) {
          /* swallow */
        }

        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }

        setIsConnected(true);
      });

      peer.on("error", (err) => {
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("peer_error", {
              message: err && err.message ? err.message : String(err),
            });
          }
        } catch (e) {
          /* swallow */
        }
        setIsConnected(false);
      });

      peer.on("close", () => {
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("peer_closed", {});
          }
        } catch (e) {
          /* swallow */
        }
        setIsConnected(false);
      });

      peer.on("connect", () => {
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("peer_connected", {});
          }
        } catch (e) {
          /* swallow */
        }
        setIsConnected(true);
      });

      peerRef.current = peer;
    }

    // Answer peer (receiver)
    function answerPeer(incomingSignal, callerSocketId, stream) {
      try {
        if (logger && typeof logger.logAction === "function") {
          logger.logAction("creating_peer_receiver", { callerSocketId });
        }
      } catch (e) {
        /* swallow */
      }

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
        sock.emit("answer", {
          signal: signal,
          to: callerSocketId,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
        }

        setIsConnected(true);
      });

      peer.on("error", (err) => {
        setIsConnected(false);
      });

      peer.on("close", () => {
        setIsConnected(false);
      });

      peer.on("connect", () => {
        try {
          if (logger && typeof logger.logAction === "function") {
            logger.logAction("peer_connected", {});
          }
        } catch (e) {
          /* swallow */
        }
        setIsConnected(true);
      });

      peer.signal(incomingSignal);
      peerRef.current = peer;
    }

    // Cleanup
    return () => {
      try {
        if (logger && typeof logger.logAction === "function") {
          logger.logAction("cleanup", {});
        }
      } catch (e) {
        /* swallow */
      }

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          track.stop();
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
      window.removeEventListener("local-leave", () => {});
    };
  }, [videoID, myName]);

  return (
    <div className="video-container-wrapper">
      <div className="videos-grid">
        <div className="video-wrapper my-video-wrapper">
          <video
            className="video-element"
            playsInline
            muted
            ref={myVideo}
            autoPlay
          />
          {/* Overlay controls on user's video */}
          <div className="video-controls-overlay">
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
          <div className="video-label">
            <span className="username-badge">{myName}</span>
          </div>
          {isConnected && (
            <div className="connection-status-overlay">
              <span className="status-dot"></span>
              <span>Connected</span>
            </div>
          )}
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
              <p>
                {remotePeerName
                  ? `Waiting for ${remotePeerName} to join...`
                  : `Waiting for other participant to join...`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
